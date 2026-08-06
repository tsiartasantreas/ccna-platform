-- ============================================================
-- NUCLEAR RESET: Drop ALL policies, recreate cleanly
-- Run this ONCE in Supabase SQL Editor
-- ============================================================

-- Step 1: Drop ALL existing policies on ALL tables
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public')
  LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON ' || r.tablename;
  END LOOP;
END $$;

-- Step 2: Create clean, simple RLS policies

-- PROFILES: Users can read/update own profile, admins can do anything
CREATE POLICY "profiles_select" ON profiles FOR SELECT TO authenticated
  USING (auth.uid() = id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "profiles_insert" ON profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update" ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true))
  WITH CHECK (auth.uid() = id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "profiles_delete" ON profiles FOR DELETE TO authenticated
  USING (auth.uid() = id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- LESSON_PROGRESS: Users can CRUD own data, admins can do anything
CREATE POLICY "lesson_progress_select" ON lesson_progress FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "lesson_progress_insert" ON lesson_progress FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "lesson_progress_update" ON lesson_progress FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true))
  WITH CHECK (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "lesson_progress_delete" ON lesson_progress FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- QUIZ_SCORES: Users can CRUD own data, admins can do anything
CREATE POLICY "quiz_scores_select" ON quiz_scores FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "quiz_scores_insert" ON quiz_scores FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "quiz_scores_update" ON quiz_scores FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true))
  WITH CHECK (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "quiz_scores_delete" ON quiz_scores FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- USER_POINTS: Users can CRUD own data, admins can do anything
CREATE POLICY "user_points_select" ON user_points FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "user_points_insert" ON user_points FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "user_points_update" ON user_points FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true))
  WITH CHECK (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "user_points_delete" ON user_points FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- ADMIN_USER_EMAILS: Only admins can access
CREATE POLICY "admin_user_emails_select" ON admin_user_emails FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "admin_user_emails_insert" ON admin_user_emails FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "admin_user_emails_delete" ON admin_user_emails FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- MODULE_FEEDBACK: Anyone can read, authenticated can insert own
CREATE POLICY "module_feedback_select" ON module_feedback FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "module_feedback_insert" ON module_feedback FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "module_feedback_update" ON module_feedback FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "module_feedback_delete" ON module_feedback FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- ADMIN_SETTINGS: Anyone can read, admins can write
CREATE POLICY "admin_settings_select" ON admin_settings FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "admin_settings_insert" ON admin_settings FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "admin_settings_update" ON admin_settings FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "admin_settings_delete" ON admin_settings FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- Step 3: Create RPC functions

-- User Dashboard Data
CREATE OR REPLACE FUNCTION user_get_dashboard_data()
RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
  result JSON;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  SELECT json_build_object(
    'profile', (SELECT row_to_json(p) FROM profiles p WHERE p.id = v_user_id),
    'lesson_progress', (SELECT COALESCE(json_agg(lp.*), '[]'::json) FROM lesson_progress lp WHERE lp.user_id = v_user_id),
    'quiz_scores', (SELECT COALESCE(json_agg(qs.*), '[]'::json) FROM quiz_scores qs WHERE qs.user_id = v_user_id),
    'user_points', (SELECT row_to_json(up) FROM user_points up WHERE up.user_id = v_user_id)
  ) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Save Quiz Score
CREATE OR REPLACE FUNCTION user_save_quiz_score(
  p_module_number INTEGER, p_score INTEGER, p_total_questions INTEGER,
  p_correct_answers INTEGER, p_time_taken INTEGER DEFAULT 0
)
RETURNS JSON AS $$
DECLARE
  v_user_id UUID; v_attempt_number INTEGER; v_points INTEGER;
  v_streak INTEGER; v_max_streak INTEGER; v_is_new_day BOOLEAN; v_result JSON;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF p_module_number < 1 OR p_module_number > 6 THEN RAISE EXCEPTION 'Invalid module'; END IF;
  IF p_score < 0 OR p_score > 100 THEN RAISE EXCEPTION 'Invalid score'; END IF;
  IF p_total_questions < 1 OR p_total_questions > 50 THEN RAISE EXCEPTION 'Invalid questions'; END IF;
  IF p_correct_answers < 0 OR p_correct_answers > p_total_questions THEN RAISE EXCEPTION 'Invalid answers'; END IF;

  SELECT COALESCE(MAX(attempt_number), 0) + 1 INTO v_attempt_number
  FROM quiz_scores WHERE user_id = v_user_id AND module_number = p_module_number;

  INSERT INTO quiz_scores (user_id, module_number, score, total_questions, correct_answers, time_taken_seconds, attempt_number)
  VALUES (v_user_id, p_module_number, p_score, p_total_questions, p_correct_answers, p_time_taken, v_attempt_number);

  v_points := p_correct_answers * 10;
  IF p_score >= 80 THEN v_points := v_points + 20; END IF;

  SELECT current_streak, longest_streak, (last_activity_date != CURRENT_DATE)
  INTO v_streak, v_max_streak, v_is_new_day FROM user_points WHERE user_id = v_user_id;

  IF v_is_new_day AND p_score >= 80 THEN v_streak := COALESCE(v_streak, 0) + 1;
  ELSIF p_score < 80 THEN v_streak := 0; END IF;

  UPDATE user_points SET total_points = total_points + v_points,
    current_streak = v_streak, longest_streak = GREATEST(COALESCE(v_max_streak, 0), v_streak),
    last_activity_date = CURRENT_DATE WHERE user_id = v_user_id;

  SELECT json_build_object('attempt_number', v_attempt_number, 'points_earned', v_points,
    'current_streak', v_streak, 'score_saved', true) INTO v_result;
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Complete Lesson
CREATE OR REPLACE FUNCTION user_complete_lesson(p_module_number INTEGER, p_lesson_number INTEGER)
RETURNS JSON AS $$
DECLARE v_user_id UUID; v_result JSON;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF p_module_number < 1 OR p_module_number > 6 THEN RAISE EXCEPTION 'Invalid module'; END IF;
  IF p_lesson_number < 1 OR p_lesson_number > 15 THEN RAISE EXCEPTION 'Invalid lesson'; END IF;

  INSERT INTO lesson_progress (user_id, module_number, lesson_number, status, completed_at)
  VALUES (v_user_id, p_module_number, p_lesson_number, 'completed', NOW())
  ON CONFLICT (user_id, module_number, lesson_number) DO UPDATE SET status = 'completed', completed_at = NOW();

  UPDATE user_points SET total_points = total_points + 5, last_activity_date = CURRENT_DATE WHERE user_id = v_user_id;

  SELECT json_build_object('module_number', p_module_number, 'lesson_number', p_lesson_number,
    'status', 'completed', 'points_earned', 5) INTO v_result;
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin Get All Data
CREATE OR REPLACE FUNCTION admin_get_all_data()
RETURNS JSON AS $$
DECLARE v_is_admin BOOLEAN; result JSON;
BEGIN
  SELECT is_admin INTO v_is_admin FROM profiles WHERE id = auth.uid();
  IF NOT v_is_admin THEN RAISE EXCEPTION 'Unauthorized: not an admin'; END IF;

  SELECT json_build_object(
    'profiles', (SELECT COALESCE(json_agg(p.*), '[]'::json) FROM profiles p),
    'lesson_progress', (SELECT COALESCE(json_agg(lp.*), '[]'::json) FROM lesson_progress lp),
    'quiz_scores', (SELECT COALESCE(json_agg(qs.*), '[]'::json) FROM quiz_scores qs),
    'user_points', (SELECT COALESCE(json_agg(up.*), '[]'::json) FROM user_points up),
    'admin_emails', (SELECT COALESCE(json_agg(ae.*), '[]'::json) FROM admin_user_emails ae),
    'feedback', (SELECT COALESCE(json_agg(f.*), '[]'::json) FROM module_feedback f)
  ) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin Update User Plan
CREATE OR REPLACE FUNCTION admin_update_user_plan(target_user_id UUID, new_plan TEXT)
RETURNS VOID AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true) THEN
    RAISE EXCEPTION 'Unauthorized: not an admin';
  END IF;
  IF new_plan NOT IN ('free', 'pro') THEN RAISE EXCEPTION 'Invalid plan'; END IF;
  UPDATE profiles SET plan = new_plan WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Delete User Account
CREATE OR REPLACE FUNCTION delete_user_account(target_user_id UUID)
RETURNS VOID AS $$
BEGIN
  IF auth.uid() != target_user_id AND NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE
  ) THEN RAISE EXCEPTION 'Unauthorized'; END IF;

  DELETE FROM lesson_progress WHERE user_id = target_user_id;
  DELETE FROM quiz_scores WHERE user_id = target_user_id;
  DELETE FROM user_points WHERE user_id = target_user_id;
  DELETE FROM admin_user_emails WHERE user_id = target_user_id;
  DELETE FROM profiles WHERE id = target_user_id;
  DELETE FROM auth.users WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Grant permissions
GRANT EXECUTE ON FUNCTION user_get_dashboard_data() TO authenticated;
GRANT EXECUTE ON FUNCTION user_save_quiz_score(INTEGER, INTEGER, INTEGER, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION user_complete_lesson(INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION admin_get_all_data() TO authenticated;
GRANT EXECUTE ON FUNCTION admin_update_user_plan(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION delete_user_account(UUID) TO authenticated;
