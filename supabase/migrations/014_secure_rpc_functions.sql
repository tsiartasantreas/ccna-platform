-- ============================================================
-- Secure RPC Functions: Bypass RLS with server-side security
-- Uses auth.uid() - no client-side user_id parameter to tamper
-- ============================================================

-- 1. User Dashboard Data: Returns ONLY current user's data
CREATE OR REPLACE FUNCTION user_get_dashboard_data()
RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
  result JSON;
BEGIN
  -- Get the authenticated user's ID from the JWT token
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Return only this user's data
  SELECT json_build_object(
    'profile', (
      SELECT row_to_json(p)
      FROM profiles p
      WHERE p.id = v_user_id
    ),
    'lesson_progress', (
      SELECT COALESCE(json_agg(lp.*), '[]'::json)
      FROM lesson_progress lp
      WHERE lp.user_id = v_user_id
    ),
    'quiz_scores', (
      SELECT COALESCE(json_agg(qs.*), '[]'::json)
      FROM quiz_scores qs
      WHERE qs.user_id = v_user_id
    ),
    'user_points', (
      SELECT row_to_json(up)
      FROM user_points up
      WHERE up.user_id = v_user_id
    )
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Save Quiz Score: Server-side validation and save
CREATE OR REPLACE FUNCTION user_save_quiz_score(
  p_module_number INTEGER,
  p_score INTEGER,
  p_total_questions INTEGER,
  p_correct_answers INTEGER,
  p_time_taken INTEGER DEFAULT 0
)
RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
  v_attempt_number INTEGER;
  v_points INTEGER;
  v_streak INTEGER;
  v_max_streak INTEGER;
  v_is_new_day BOOLEAN;
  v_result JSON;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Validate inputs
  IF p_module_number < 1 OR p_module_number > 6 THEN
    RAISE EXCEPTION 'Invalid module number';
  END IF;

  IF p_score < 0 OR p_score > 100 THEN
    RAISE EXCEPTION 'Invalid score';
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
  WHERE user_id = v_user_id AND module_number = p_module_number;

  -- Insert quiz score
  INSERT INTO quiz_scores (user_id, module_number, score, total_questions, correct_answers, time_taken_seconds, attempt_number)
  VALUES (v_user_id, p_module_number, p_score, p_total_questions, p_correct_answers, p_time_taken, v_attempt_number);

  -- Calculate points (server-side)
  v_points := p_correct_answers * 10;
  IF p_score >= 80 THEN
    v_points := v_points + 20; -- Passing bonus
  END IF;

  -- Update user points
  SELECT current_streak, longest_streak, (last_activity_date != CURRENT_DATE)
  INTO v_streak, v_max_streak, v_is_new_day
  FROM user_points
  WHERE user_id = v_user_id;

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
  WHERE user_id = v_user_id;

  -- Return result
  SELECT json_build_object(
    'attempt_number', v_attempt_number,
    'points_earned', v_points,
    'current_streak', v_streak,
    'score_saved', true
  ) INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Complete Lesson: Server-side validation and save
CREATE OR REPLACE FUNCTION user_complete_lesson(
  p_module_number INTEGER,
  p_lesson_number INTEGER
)
RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
  v_result JSON;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Validate inputs
  IF p_module_number < 1 OR p_module_number > 6 THEN
    RAISE EXCEPTION 'Invalid module number';
  END IF;

  IF p_lesson_number < 1 OR p_lesson_number > 15 THEN
    RAISE EXCEPTION 'Invalid lesson number';
  END IF;

  -- Upsert lesson progress
  INSERT INTO lesson_progress (user_id, module_number, lesson_number, status, completed_at)
  VALUES (v_user_id, p_module_number, p_lesson_number, 'completed', NOW())
  ON CONFLICT (user_id, module_number, lesson_number)
  DO UPDATE SET status = 'completed', completed_at = NOW();

  -- Award points for lesson completion
  UPDATE user_points
  SET total_points = total_points + 5,
      last_activity_date = CURRENT_DATE
  WHERE user_id = v_user_id;

  -- Return result
  SELECT json_build_object(
    'module_number', p_module_number,
    'lesson_number', p_lesson_number,
    'status', 'completed',
    'points_earned', 5
  ) INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Admin Data: Returns ALL data (admin only)
CREATE OR REPLACE FUNCTION admin_get_all_data()
RETURNS JSON AS $$
DECLARE
  v_is_admin BOOLEAN;
  result JSON;
BEGIN
  -- Check if user is admin
  SELECT is_admin INTO v_is_admin
  FROM profiles
  WHERE id = auth.uid();

  IF NOT v_is_admin THEN
    RAISE EXCEPTION 'Unauthorized: not an admin';
  END IF;

  -- Build complete admin dashboard data
  SELECT json_build_object(
    'profiles', (
      SELECT COALESCE(json_agg(p.*), '[]'::json)
      FROM profiles p
    ),
    'lesson_progress', (
      SELECT COALESCE(json_agg(lp.*), '[]'::json)
      FROM lesson_progress lp
    ),
    'quiz_scores', (
      SELECT COALESCE(json_agg(qs.*), '[]'::json)
      FROM quiz_scores qs
    ),
    'user_points', (
      SELECT COALESCE(json_agg(up.*), '[]'::json)
      FROM user_points up
    ),
    'admin_emails', (
      SELECT COALESCE(json_agg(ae.*), '[]'::json)
      FROM admin_user_emails ae
    ),
    'feedback', (
      SELECT COALESCE(json_agg(f.*), '[]'::json)
      FROM module_feedback f
    )
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION user_get_dashboard_data() TO authenticated;
GRANT EXECUTE ON FUNCTION user_save_quiz_score(INTEGER, INTEGER, INTEGER, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION user_complete_lesson(INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION admin_get_all_data() TO authenticated;
