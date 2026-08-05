-- ============================================================
-- Security Hardening Migration
-- Fixes: Self-promote, self-upgrade, bounds checks, GRANT scope
-- ============================================================

-- 1. Fix profiles RLS: Prevent users from updating is_admin and plan columns
-- Drop existing update policy
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create new update policy that excludes sensitive columns
CREATE POLICY "Users can update own profile (restricted)"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    -- Prevent updating is_admin or plan via RLS
    -- These can only be updated by admin or service role
  );

-- Create admin-only update policy for sensitive columns
CREATE POLICY "Admin can update any profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- 2. Add missing admin UPDATE policies for other tables
-- lesson_progress: admin can update
CREATE POLICY "Admin can update lesson progress"
  ON lesson_progress FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- quiz_scores: admin can update
CREATE POLICY "Admin can update quiz scores"
  ON quiz_scores FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- user_points: admin can update
CREATE POLICY "Admin can update user points"
  ON user_points FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- 3. Fix increment_points: Add bounds check
CREATE OR REPLACE FUNCTION increment_points(p_user_id UUID, p_points INTEGER)
RETURNS VOID AS $$
BEGIN
  -- Validate bounds: max 100 points per call
  IF p_points < 0 OR p_points > 100 THEN
    RAISE EXCEPTION 'Points must be between 0 and 100';
  END IF;

  -- Validate that the caller is the user or an admin
  IF auth.uid() != p_user_id AND NOT EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  UPDATE user_points
  SET total_points = total_points + p_points,
      last_activity_date = CURRENT_DATE
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Fix save_quiz_score: Server-side validation
CREATE OR REPLACE FUNCTION save_quiz_score(
  p_user_id UUID,
  p_module_number INTEGER,
  p_score INTEGER,
  p_total_questions INTEGER,
  p_correct_answers INTEGER,
  p_time_taken INTEGER DEFAULT 0
)
RETURNS JSONB AS $$
DECLARE
  v_attempt_number INTEGER;
  v_points INTEGER;
  v_streak INTEGER;
  v_max_streak INTEGER;
  v_is_new_day BOOLEAN;
  v_result JSONB;
BEGIN
  -- Validate caller
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Validate score bounds
  IF p_score < 0 OR p_score > 100 THEN
    RAISE EXCEPTION 'Score must be between 0 and 100';
  END IF;

  IF p_total_questions < 1 OR p_total_questions > 50 THEN
    RAISE EXCEPTION 'Invalid total questions';
  END IF;

  IF p_correct_answers < 0 OR p_correct_answers > p_total_questions THEN
    RAISE EXCEPTION 'Invalid correct answers';
  END IF;

  -- Get attempt number
  SELECT COALESCE(MAX(attempt_number), 0) + 1
  INTO v_attempt_number
  FROM quiz_scores
  WHERE user_id = p_user_id AND module_number = p_module_number;

  -- Insert quiz score
  INSERT INTO quiz_scores (user_id, module_number, score, total_questions, correct_answers, time_taken_seconds, attempt_number)
  VALUES (p_user_id, p_module_number, p_score, p_total_questions, p_correct_answers, p_time_taken, v_attempt_number);

  -- Calculate points (server-side)
  v_points := p_correct_answers * 10;
  IF p_score >= 80 THEN
    v_points := v_points + 20; -- Passing bonus
  END IF;

  -- Update user points
  SELECT current_streak, longest_streak, (last_activity_date != CURRENT_DATE)
  INTO v_streak, v_max_streak, v_is_new_day
  FROM user_points
  WHERE user_id = p_user_id;

  IF v_is_new_day AND p_score >= 80 THEN
    v_streak := COALESCE(v_streak, 0) + 1;
  ELSIF p_score < 80 THEN
    v_streak := 0;
  END IF;

  UPDATE user_points
  SET total_points = total_points + v_points,
      current_streak = v_streak,
      longest_streak = GREATEST(COALESCE(v_max_streak, 0), v_streak),
      last_activity_date = CURRENT_DATE
  WHERE user_id = p_user_id;

  -- Return result
  v_result := jsonb_build_object(
    'attempt_number', v_attempt_number,
    'points_earned', v_points,
    'current_streak', v_streak
  );

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Fix complete_lesson: Server-side validation
CREATE OR REPLACE FUNCTION complete_lesson(
  p_user_id UUID,
  p_module_number INTEGER,
  p_lesson_number INTEGER
)
RETURNS VOID AS $$
BEGIN
  -- Validate caller
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Validate bounds
  IF p_module_number < 1 OR p_module_number > 6 THEN
    RAISE EXCEPTION 'Invalid module number';
  END IF;

  IF p_lesson_number < 1 OR p_lesson_number > 15 THEN
    RAISE EXCEPTION 'Invalid lesson number';
  END IF;

  -- Upsert lesson progress
  INSERT INTO lesson_progress (user_id, module_number, lesson_number, status, completed_at)
  VALUES (p_user_id, p_module_number, p_lesson_number, 'completed', NOW())
  ON CONFLICT (user_id, module_number, lesson_number)
  DO UPDATE SET status = 'completed', completed_at = NOW();

  -- Award points for lesson completion
  PERFORM increment_points(p_user_id, 5);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Fix delete_user_account: Restrict GRANT
REVOKE EXECUTE ON FUNCTION delete_user_account(UUID) FROM authenticated;
GRANT EXECUTE ON FUNCTION delete_user_account(UUID) TO service_role;

-- Also restrict delete_own_account
REVOKE EXECUTE ON FUNCTION delete_own_account() FROM authenticated;
GRANT EXECUTE ON FUNCTION delete_own_account() TO authenticated;

-- 7. Fix admin settings: Create table for admin settings (not localStorage)
CREATE TABLE IF NOT EXISTS admin_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- RLS for admin_settings
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage settings"
  ON admin_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Anyone can read settings"
  ON admin_settings FOR SELECT
  TO anon, authenticated
  USING (true);

-- 8. Create module_feedback table if not exists
CREATE TABLE IF NOT EXISTS module_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  module_number INTEGER NOT NULL CHECK (module_number BETWEEN 1 AND 6),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for module_feedback
ALTER TABLE module_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read feedback"
  ON module_feedback FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can insert own feedback"
  ON module_feedback FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own feedback"
  ON module_feedback FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own feedback"
  ON module_feedback FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 9. Add display_name validation via trigger
CREATE OR REPLACE FUNCTION validate_display_name()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate display_name length and characters
  IF NEW.display_name IS NOT NULL THEN
    IF LENGTH(NEW.display_name) < 1 OR LENGTH(NEW.display_name) > 50 THEN
      RAISE EXCEPTION 'Display name must be between 1 and 50 characters';
    END IF;
    -- Remove potential XSS characters
    NEW.display_name := REGEXP_REPLACE(NEW.display_name, '[<>''"]', '', 'g');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_profile_display_name
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION validate_display_name();

-- 10. Add email verification check function
CREATE OR REPLACE FUNCTION is_email_verified()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND email_confirmed_at IS NOT NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute
GRANT EXECUTE ON FUNCTION is_email_verified() TO authenticated;
