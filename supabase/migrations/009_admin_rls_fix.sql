-- ============================================================
-- Admin RLS Fix: Allow admins to see all profiles
-- ============================================================

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Admin can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admin can view all profiles" ON profiles;

-- Create policy allowing admins to read ALL profiles
CREATE POLICY "Admin can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    -- User can read their own profile
    auth.uid() = id
    OR
    -- Admin can read any profile
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Also fix admin access to other tables
DROP POLICY IF EXISTS "Admin can read all lesson progress" ON lesson_progress;
CREATE POLICY "Admin can read all lesson progress"
  ON lesson_progress FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

DROP POLICY IF EXISTS "Admin can read all quiz scores" ON quiz_scores;
CREATE POLICY "Admin can read all quiz scores"
  ON quiz_scores FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

DROP POLICY IF EXISTS "Admin can read all user points" ON user_points;
CREATE POLICY "Admin can read all user points"
  ON user_points FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Also ensure admin can read admin_user_emails
DROP POLICY IF EXISTS "Admin can read all emails" ON admin_user_emails;
CREATE POLICY "Admin can read all emails"
  ON admin_user_emails FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );
