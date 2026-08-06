-- ============================================================
-- FIX: Remove infinite recursion from RLS policies
-- Admin access is handled by RPC functions (SECURITY DEFINER)
-- RLS policies should be SIMPLE: users can only access own data
-- ============================================================

-- Drop ALL existing policies
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN (SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public')
  LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON ' || r.tablename;
  END LOOP;
END $$;

-- PROFILES: Users can only access their own profile
CREATE POLICY "profiles_select" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- LESSON_PROGRESS: Users can only access their own progress
CREATE POLICY "lesson_progress_select" ON lesson_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "lesson_progress_insert" ON lesson_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "lesson_progress_update" ON lesson_progress FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- QUIZ_SCORES: Users can only access their own scores
CREATE POLICY "quiz_scores_select" ON quiz_scores FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "quiz_scores_insert" ON quiz_scores FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- USER_POINTS: Users can only access their own points
CREATE POLICY "user_points_select" ON user_points FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "user_points_insert" ON user_points FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_points_update" ON user_points FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ADMIN_USER_EMAILS: Only accessible via RPC (no direct access)
-- No policies = no direct access, only through SECURITY DEFINER functions

-- MODULE_FEEDBACK: Anyone can read, authenticated can insert own
CREATE POLICY "module_feedback_select" ON module_feedback FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "module_feedback_insert" ON module_feedback FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- ADMIN_SETTINGS: Anyone can read
CREATE POLICY "admin_settings_select" ON admin_settings FOR SELECT TO anon, authenticated USING (true);

-- RPC Functions (SECURITY DEFINER bypasses RLS)
CREATE OR REPLACE FUNCTION check_is_admin() RETURNS BOOLEAN AS $$
BEGIN RETURN EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true); END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION user_get_dashboard_data() RETURNS JSON AS $$
DECLARE v_user_id UUID; result JSON;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT json_build_object(
    'profile', (SELECT row_to_json(p) FROM profiles p WHERE p.id = v_user_id),
    'lesson_progress', (SELECT COALESCE(json_agg(lp.*), '[]'::json) FROM lesson_progress lp WHERE lp.user_id = v_user_id),
    'quiz_scores', (SELECT COALESCE(json_agg(qs.*), '[]'::json) FROM quiz_scores qs WHERE qs.user_id = v_user_id),
    'user_points', (SELECT row_to_json(up) FROM user_points up WHERE up.user_id = v_user_id)
  ) INTO result; RETURN result;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION admin_get_all_data() RETURNS JSON AS $$
DECLARE v_is_admin BOOLEAN; result JSON;
BEGIN
  SELECT is_admin INTO v_is_admin FROM profiles WHERE id = auth.uid();
  IF NOT v_is_admin THEN RAISE EXCEPTION 'Unauthorized'; END IF;
  SELECT json_build_object(
    'profiles', (SELECT COALESCE(json_agg(p.*), '[]'::json) FROM profiles p),
    'lesson_progress', (SELECT COALESCE(json_agg(lp.*), '[]'::json) FROM lesson_progress lp),
    'quiz_scores', (SELECT COALESCE(json_agg(qs.*), '[]'::json) FROM quiz_scores qs),
    'user_points', (SELECT COALESCE(json_agg(up.*), '[]'::json) FROM user_points up),
    'admin_emails', (SELECT COALESCE(json_agg(ae.*), '[]'::json) FROM admin_user_emails ae)
  ) INTO result; RETURN result;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION admin_update_user_plan(target_user_id UUID, new_plan TEXT) RETURNS VOID AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true) THEN RAISE EXCEPTION 'Unauthorized'; END IF;
  UPDATE profiles SET plan = new_plan WHERE id = target_user_id;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION delete_user_account(target_user_id UUID) RETURNS VOID AS $$
BEGIN
  IF auth.uid() != target_user_id AND NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE) THEN RAISE EXCEPTION 'Unauthorized'; END IF;
  DELETE FROM lesson_progress WHERE user_id = target_user_id; DELETE FROM quiz_scores WHERE user_id = target_user_id;
  DELETE FROM user_points WHERE user_id = target_user_id; DELETE FROM admin_user_emails WHERE user_id = target_user_id;
  DELETE FROM profiles WHERE id = target_user_id; DELETE FROM auth.users WHERE id = target_user_id;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grants
GRANT EXECUTE ON FUNCTION check_is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION user_get_dashboard_data() TO authenticated;
GRANT EXECUTE ON FUNCTION admin_get_all_data() TO authenticated;
GRANT EXECUTE ON FUNCTION admin_update_user_plan(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION delete_user_account(UUID) TO authenticated;
