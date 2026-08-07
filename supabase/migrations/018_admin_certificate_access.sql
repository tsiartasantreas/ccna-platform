-- ============================================================
-- Admin Certificate Access
-- Update admin_get_all_data to include certificate verifications
-- ============================================================

-- Update admin_get_all_data to include certificate verifications
CREATE OR REPLACE FUNCTION admin_get_all_data()
RETURNS JSON AS $$
DECLARE v_is_admin BOOLEAN; result JSON;
BEGIN
  SELECT is_admin INTO v_is_admin FROM profiles WHERE id = auth.uid();
  IF NOT v_is_admin THEN RAISE EXCEPTION 'Unauthorized'; END IF;

  SELECT json_build_object(
    'profiles', (SELECT COALESCE(json_agg(p.*), '[]'::json) FROM profiles p),
    'lesson_progress', (SELECT COALESCE(json_agg(lp.*), '[]'::json) FROM lesson_progress lp),
    'quiz_scores', (SELECT COALESCE(json_agg(qs.*), '[]'::json) FROM quiz_scores qs),
    'user_points', (SELECT COALESCE(json_agg(up.*), '[]'::json) FROM user_points up),
    'admin_emails', (SELECT COALESCE(json_agg(ae.*), '[]'::json) FROM admin_user_emails ae),
    'feedback', (SELECT COALESCE(json_agg(f.*), '[]'::json) FROM module_feedback f),
    'certificates', (SELECT COALESCE(json_agg(cv.*), '[]'::json) FROM certificate_verifications cv)
  ) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute
GRANT EXECUTE ON FUNCTION admin_get_all_data() TO authenticated;
