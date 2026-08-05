-- ============================================================
-- Security Fixes Migration
-- ============================================================

-- 1. Fix increment_points RPC — add auth check
CREATE OR REPLACE FUNCTION increment_points(p_user_id UUID, p_points INTEGER)
RETURNS VOID AS $$
BEGIN
  -- Only allow users to increment their own points
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Cannot modify another user''s points';
  END IF;

  UPDATE user_points
  SET total_points = total_points + p_points,
      updated_at = NOW()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Add DELETE policies for GDPR compliance

-- Profiles: users can delete their own profile
CREATE POLICY "Users can delete own profile"
  ON profiles FOR DELETE
  USING (auth.uid() = id);

-- Lesson Progress: users can delete their own progress
CREATE POLICY "Users can delete own lesson progress"
  ON lesson_progress FOR DELETE
  USING (auth.uid() = user_id);

-- Quiz Scores: users can delete their own scores
CREATE POLICY "Users can delete own quiz scores"
  ON quiz_scores FOR DELETE
  USING (auth.uid() = user_id);

-- User Points: users can delete their own points
CREATE POLICY "Users can delete own points"
  ON user_points FOR DELETE
  USING (auth.uid() = user_id);

-- Admin can delete any data
CREATE POLICY "Admin can delete any profile"
  ON profiles FOR DELETE
  USING (auth.jwt() ->> 'email' = 'tsiartasantreas@gmail.com');

CREATE POLICY "Admin can delete any lesson progress"
  ON lesson_progress FOR DELETE
  USING (auth.jwt() ->> 'email' = 'tsiartasantreas@gmail.com');

CREATE POLICY "Admin can delete any quiz scores"
  ON quiz_scores FOR DELETE
  USING (auth.jwt() ->> 'email' = 'tsiartasantreas@gmail.com');

CREATE POLICY "Admin can delete any user points"
  ON user_points FOR DELETE
  USING (auth.jwt() ->> 'email' = 'tsiartasantreas@gmail.com');

-- 3. Add admin_user_emails trigger fix (ensure email syncs)
CREATE OR REPLACE FUNCTION sync_user_email()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO admin_user_emails (user_id, email_encrypted)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (user_id) DO UPDATE SET email_encrypted = NEW.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
