-- ============================================================
-- Server-Side Functions for Sensitive Operations
-- ============================================================
-- These functions run server-side in Supabase, not in the browser.
-- They are protected by RLS and SECURITY DEFINER.

-- 1. Admin: Update user plan
CREATE OR REPLACE FUNCTION admin_update_user_plan(
  target_user_id UUID,
  new_plan TEXT
)
RETURNS VOID AS $$
BEGIN
  -- Only admin can call this
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE) THEN
    RAISE EXCEPTION 'Unauthorized: admin access required';
  END IF;

  -- Validate plan value
  IF new_plan NOT IN ('free', 'pro') THEN
    RAISE EXCEPTION 'Invalid plan: must be free or pro';
  END IF;

  UPDATE profiles SET plan = new_plan WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. User: Complete lesson (server-side validation)
CREATE OR REPLACE FUNCTION complete_lesson(
  p_module_number INTEGER,
  p_lesson_number INTEGER,
  p_time_spent INTEGER DEFAULT 0
)
RETURNS VOID AS $$
BEGIN
  -- Validate inputs
  IF p_module_number NOT BETWEEN 1 AND 6 THEN
    RAISE EXCEPTION 'Invalid module number';
  END IF;

  IF p_lesson_number NOT BETWEEN 1 AND 8 THEN
    RAISE EXCEPTION 'Invalid lesson number';
  END IF;

  INSERT INTO lesson_progress (user_id, module_number, lesson_number, status, time_spent_seconds, completed_at)
  VALUES (auth.uid(), p_module_number, p_lesson_number, 'completed', p_time_spent, NOW())
  ON CONFLICT (user_id, module_number, lesson_number)
  DO UPDATE SET
    status = 'completed',
    time_spent_seconds = lesson_progress.time_spent_seconds + p_time_spent,
    completed_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. User: Save quiz score (server-side validation)
CREATE OR REPLACE FUNCTION save_quiz_score(
  p_module_number INTEGER,
  p_score NUMERIC,
  p_total_questions INTEGER,
  p_correct_answers INTEGER,
  p_time_taken INTEGER
)
RETURNS UUID AS $$
DECLARE
  v_attempt_number INTEGER;
  v_quiz_id UUID;
  v_points INTEGER;
  v_streak INTEGER;
  v_max_streak INTEGER;
  v_today DATE;
BEGIN
  -- Validate inputs
  IF p_module_number NOT BETWEEN 1 AND 6 THEN
    RAISE EXCEPTION 'Invalid module number';
  END IF;

  IF p_score < 0 OR p_score > 100 THEN
    RAISE EXCEPTION 'Invalid score';
  END IF;

  -- Get attempt number
  SELECT COALESCE(MAX(attempt_number), 0) + 1
  INTO v_attempt_number
  FROM quiz_scores
  WHERE user_id = auth.uid() AND module_number = p_module_number;

  -- Insert quiz score
  INSERT INTO quiz_scores (user_id, module_number, score, total_questions, correct_answers, time_taken_seconds, attempt_number)
  VALUES (auth.uid(), p_module_number, p_score, p_total_questions, p_correct_answers, p_time_taken, v_attempt_number)
  RETURNING id INTO v_quiz_id;

  -- Calculate points
  v_points := p_correct_answers * 10;

  -- Update user points
  SELECT current_streak, longest_streak, last_activity_date
  INTO v_streak, v_max_streak, v_today
  FROM user_points WHERE user_id = auth.uid();

  IF v_streak IS NULL THEN
    INSERT INTO user_points (user_id, total_points, current_streak, longest_streak, last_activity_date)
    VALUES (auth.uid(), v_points, 1, 1, CURRENT_DATE);
  ELSE
    UPDATE user_points SET
      total_points = total_points + v_points,
      current_streak = CASE WHEN v_today < CURRENT_DATE THEN current_streak + 1 ELSE current_streak END,
      longest_streak = GREATEST(longest_streak, CASE WHEN v_today < CURRENT_DATE THEN current_streak + 1 ELSE current_streak END),
      last_activity_date = CURRENT_DATE
    WHERE user_id = auth.uid();
  END IF;

  RETURN v_quiz_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. User: Delete own account (GDPR)
CREATE OR REPLACE FUNCTION delete_own_account()
RETURNS VOID AS $$
BEGIN
  DELETE FROM lesson_progress WHERE user_id = auth.uid();
  DELETE FROM quiz_scores WHERE user_id = auth.uid();
  DELETE FROM user_points WHERE user_id = auth.uid();
  DELETE FROM admin_user_emails WHERE user_id = auth.uid();
  DELETE FROM profiles WHERE id = auth.uid();
  -- Note: auth.users deletion requires admin API
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Admin: Get all user stats (server-side aggregation)
CREATE OR REPLACE FUNCTION admin_get_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT json_build_object(
    'total_users', (SELECT COUNT(*) FROM profiles),
    'pro_users', (SELECT COUNT(*) FROM profiles WHERE plan = 'pro'),
    'free_users', (SELECT COUNT(*) FROM profiles WHERE plan = 'free'),
    'total_lessons_completed', (SELECT COUNT(*) FROM lesson_progress WHERE status = 'completed'),
    'total_quizzes_taken', (SELECT COUNT(*) FROM quiz_scores),
    'avg_quiz_score', (SELECT COALESCE(ROUND(AVG(score), 1), 0) FROM quiz_scores),
    'new_users_this_week', (SELECT COUNT(*) FROM profiles WHERE created_at >= NOW() - INTERVAL '7 days')
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION admin_update_user_plan(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION complete_lesson(INTEGER, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION save_quiz_score(INTEGER, NUMERIC, INTEGER, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION delete_own_account() TO authenticated;
GRANT EXECUTE ON FUNCTION admin_get_stats() TO authenticated;
