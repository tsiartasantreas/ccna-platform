-- ============================================================
-- Fix Streak Tracking & Add Progress Comparison
-- ============================================================

-- 1. Update user_complete_lesson to track streaks
CREATE OR REPLACE FUNCTION user_complete_lesson(
  p_module_number INTEGER,
  p_lesson_number INTEGER
)
RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
  v_result JSON;
  v_current_streak INTEGER;
  v_longest_streak INTEGER;
  v_last_activity DATE;
  v_today DATE;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

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

  -- Update streak
  v_today := CURRENT_DATE;

  SELECT current_streak, longest_streak, last_activity_date
  INTO v_current_streak, v_longest_streak, v_last_activity
  FROM user_points
  WHERE user_id = v_user_id;

  -- Calculate new streak
  IF v_last_activity IS NULL THEN
    -- First activity ever
    v_current_streak := 1;
  ELSIF v_last_activity = v_today THEN
    -- Already active today, keep streak
    v_current_streak := COALESCE(v_current_streak, 1);
  ELSIF v_last_activity = v_today - INTERVAL '1 day' THEN
    -- Consecutive day, increment streak
    v_current_streak := COALESCE(v_current_streak, 0) + 1;
  ELSE
    -- Streak broken, reset to 1
    v_current_streak := 1;
  END IF;

  v_longest_streak := GREATEST(COALESCE(v_longest_streak, 0), v_current_streak);

  -- Update user points
  UPDATE user_points
  SET total_points = total_points + 5,
      current_streak = v_current_streak,
      longest_streak = v_longest_streak,
      last_activity_date = v_today
  WHERE user_id = v_user_id;

  -- If no row exists, create one
  IF NOT FOUND THEN
    INSERT INTO user_points (user_id, total_points, current_streak, longest_streak, last_activity_date)
    VALUES (v_user_id, 5, v_current_streak, v_longest_streak, v_today);
  END IF;

  SELECT json_build_object(
    'module_number', p_module_number,
    'lesson_number', p_lesson_number,
    'status', 'completed',
    'points_earned', 5,
    'current_streak', v_current_streak
  ) INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Update user_save_quiz_score to fix streak logic
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
  v_last_activity DATE;
  v_today DATE;
  v_result JSON;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

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

  -- Calculate points
  v_points := p_correct_answers * 10;
  IF p_score >= 80 THEN
    v_points := v_points + 20;
  END IF;

  -- Update streak
  v_today := CURRENT_DATE;

  SELECT current_streak, longest_streak, last_activity_date
  INTO v_streak, v_max_streak, v_last_activity
  FROM user_points
  WHERE user_id = v_user_id;

  IF v_last_activity IS NULL THEN
    v_streak := 1;
  ELSIF v_last_activity = v_today THEN
    v_streak := COALESCE(v_streak, 1);
  ELSIF v_last_activity = v_today - INTERVAL '1 day' THEN
    v_streak := COALESCE(v_streak, 0) + 1;
  ELSE
    v_streak := 1;
  END IF;

  v_max_streak := GREATEST(COALESCE(v_max_streak, 0), v_streak);

  UPDATE user_points
  SET total_points = total_points + v_points,
      current_streak = v_streak,
      longest_streak = v_max_streak,
      last_activity_date = v_today
  WHERE user_id = v_user_id;

  IF NOT FOUND THEN
    INSERT INTO user_points (user_id, total_points, current_streak, longest_streak, last_activity_date)
    VALUES (v_user_id, v_points, v_streak, v_max_streak, v_today);
  END IF;

  SELECT json_build_object(
    'attempt_number', v_attempt_number,
    'points_earned', v_points,
    'current_streak', v_streak,
    'score_saved', true
  ) INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create function to get user progress comparison data
CREATE OR REPLACE FUNCTION get_progress_comparison()
RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
  v_user_lessons INTEGER;
  v_user_avg_score NUMERIC;
  v_avg_lessons NUMERIC;
  v_avg_score NUMERIC;
  v_total_users INTEGER;
  v_result JSON;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Get user's completed lessons
  SELECT COUNT(*) INTO v_user_lessons
  FROM lesson_progress
  WHERE user_id = v_user_id AND status = 'completed';

  -- Get user's average quiz score
  SELECT COALESCE(AVG(score), 0) INTO v_user_avg_score
  FROM (
    SELECT DISTINCT ON (module_number) score
    FROM quiz_scores
    WHERE user_id = v_user_id
    ORDER BY module_number, score DESC
  ) best_scores;

  -- Get average completed lessons across all users
  SELECT COALESCE(AVG(lesson_count), 0), COUNT(*) INTO v_avg_lessons, v_total_users
  FROM (
    SELECT user_id, COUNT(*) as lesson_count
    FROM lesson_progress
    WHERE status = 'completed'
    GROUP BY user_id
  ) user_lessons;

  -- Get average quiz score across all users
  SELECT COALESCE(AVG(avg_score), 0) INTO v_avg_score
  FROM (
    SELECT user_id, AVG(score) as avg_score
    FROM (
      SELECT DISTINCT ON (user_id, module_number) user_id, score
      FROM quiz_scores
      ORDER BY user_id, module_number, score DESC
    ) best_scores
    GROUP BY user_id
  ) user_scores;

  SELECT json_build_object(
    'user_lessons', v_user_lessons,
    'user_avg_score', ROUND(v_user_avg_score, 1),
    'avg_lessons', ROUND(v_avg_lessons, 1),
    'avg_score', ROUND(v_avg_score, 1),
    'total_users', v_total_users,
    'total_lessons', 35
  ) INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_progress_comparison() TO authenticated;
