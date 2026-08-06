-- ============================================================
-- Fix Admin Dashboard Access
-- Drop ALL conflicting policies and create clean admin policies
-- ============================================================

-- PROFILES: Drop all existing SELECT policies and recreate
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Admin can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admin can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;

-- Single unified SELECT policy for profiles
CREATE POLICY "profiles_select_policy"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id
    OR
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

-- LESSON_PROGRESS: Drop all existing SELECT policies and recreate
DROP POLICY IF EXISTS "Users can view own progress" ON lesson_progress;
DROP POLICY IF EXISTS "Users can read own lesson progress" ON lesson_progress;
DROP POLICY IF EXISTS "Admin can read all lesson progress" ON lesson_progress;

CREATE POLICY "lesson_progress_select_policy"
  ON lesson_progress FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

-- QUIZ_SCORES: Drop all existing SELECT policies and recreate
DROP POLICY IF EXISTS "Users can view own scores" ON quiz_scores;
DROP POLICY IF EXISTS "Users can read own quiz scores" ON quiz_scores;
DROP POLICY IF EXISTS "Admin can read all quiz scores" ON quiz_scores;

CREATE POLICY "quiz_scores_select_policy"
  ON quiz_scores FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

-- USER_POINTS: Drop all existing SELECT policies and recreate
DROP POLICY IF EXISTS "Users can view own points" ON user_points;
DROP POLICY IF EXISTS "Users can read own user points" ON user_points;
DROP POLICY IF EXISTS "Admin can read all user points" ON user_points;

CREATE POLICY "user_points_select_policy"
  ON user_points FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

-- ADMIN_USER_EMAILS: Drop all existing SELECT policies and recreate
DROP POLICY IF EXISTS "Admin can read all emails" ON admin_user_emails;
DROP POLICY IF EXISTS "Users can read own email" ON admin_user_emails;

CREATE POLICY "admin_user_emails_select_policy"
  ON admin_user_emails FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

-- MODULE_FEEDBACK: Keep public read
DROP POLICY IF EXISTS "Anyone can read feedback" ON module_feedback;
CREATE POLICY "feedback_select_policy"
  ON module_feedback FOR SELECT
  TO anon, authenticated
  USING (true);
