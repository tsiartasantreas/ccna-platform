-- ============================================================
-- Fix User Data Access: Ensure users can read their own data
-- ============================================================

-- LESSON_PROGRESS: Ensure users can read their own progress OR admin can read all
DROP POLICY IF EXISTS "Users can read own lesson progress" ON lesson_progress;
DROP POLICY IF EXISTS "Users can view own progress" ON lesson_progress;
DROP POLICY IF EXISTS "lesson_progress_select_policy" ON lesson_progress;

CREATE POLICY "lesson_progress_read_own"
  ON lesson_progress FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

-- Also allow insert and update for own data
DROP POLICY IF EXISTS "Users can insert own lesson progress" ON lesson_progress;
DROP POLICY IF EXISTS "Users can update own lesson progress" ON lesson_progress;

CREATE POLICY "lesson_progress_insert_own"
  ON lesson_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "lesson_progress_update_own"
  ON lesson_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- QUIZ_SCORES: Ensure users can read their own scores OR admin can read all
DROP POLICY IF EXISTS "Users can read own quiz scores" ON quiz_scores;
DROP POLICY IF EXISTS "Users can view own scores" ON quiz_scores;
DROP POLICY IF EXISTS "quiz_scores_select_policy" ON quiz_scores;

CREATE POLICY "quiz_scores_read_own"
  ON quiz_scores FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

-- Also allow insert for own data
DROP POLICY IF EXISTS "Users can insert own quiz scores" ON quiz_scores;

CREATE POLICY "quiz_scores_insert_own"
  ON quiz_scores FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- USER_POINTS: Ensure users can read their own points OR admin can read all
DROP POLICY IF EXISTS "Users can read own user points" ON user_points;
DROP POLICY IF EXISTS "Users can view own points" ON user_points;
DROP POLICY IF EXISTS "user_points_select_policy" ON user_points;

CREATE POLICY "user_points_read_own"
  ON user_points FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

-- Also allow update for own data
DROP POLICY IF EXISTS "Users can update own user points" ON user_points;

CREATE POLICY "user_points_update_own"
  ON user_points FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Also allow insert for own data
DROP POLICY IF EXISTS "Users can insert own user points" ON user_points;

CREATE POLICY "user_points_insert_own"
  ON user_points FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- PROFILES: Ensure users can read their own profile OR admin can read all
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;

CREATE POLICY "profiles_read_own"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id
    OR
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

-- Also allow update for own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile (restricted)" ON profiles;

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Also allow insert for own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
