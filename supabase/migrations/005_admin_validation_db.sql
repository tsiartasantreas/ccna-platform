-- ============================================================
-- Move Admin Validation to Database
-- ============================================================

-- 1. Add is_admin column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- 2. Set the admin user
UPDATE profiles SET is_admin = TRUE WHERE email = 'tsiartasantreas@gmail.com';

-- 3. Create function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND is_admin = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Update all admin RLS policies to use is_admin() function

-- Profiles: admin can view all
DROP POLICY IF EXISTS "Admin can view all profiles" ON profiles;
CREATE POLICY "Admin can view all profiles"
  ON profiles FOR SELECT
  USING (is_admin());

-- Profiles: admin can update any
DROP POLICY IF EXISTS "Admin can update any profile" ON profiles;
CREATE POLICY "Admin can update any profile"
  ON profiles FOR UPDATE
  USING (is_admin());

-- Profiles: admin can delete any
DROP POLICY IF EXISTS "Admin can delete any profile" ON profiles;
CREATE POLICY "Admin can delete any profile"
  ON profiles FOR DELETE
  USING (is_admin());

-- Lesson progress: admin can view all
DROP POLICY IF EXISTS "Admin can view all lesson progress" ON lesson_progress;
CREATE POLICY "Admin can view all lesson progress"
  ON lesson_progress FOR SELECT
  USING (is_admin());

-- Lesson progress: admin can delete any
DROP POLICY IF EXISTS "Admin can delete any lesson progress" ON lesson_progress;
CREATE POLICY "Admin can delete any lesson progress"
  ON lesson_progress FOR DELETE
  USING (is_admin());

-- Quiz scores: admin can view all
DROP POLICY IF EXISTS "Admin can view all quiz scores" ON quiz_scores;
CREATE POLICY "Admin can view all quiz scores"
  ON quiz_scores FOR SELECT
  USING (is_admin());

-- Quiz scores: admin can delete any
DROP POLICY IF EXISTS "Admin can delete any quiz scores" ON quiz_scores;
CREATE POLICY "Admin can delete any quiz scores"
  ON quiz_scores FOR DELETE
  USING (is_admin());

-- User points: admin can view all
DROP POLICY IF EXISTS "Admin can view all user points" ON user_points;
CREATE POLICY "Admin can view all user points"
  ON user_points FOR SELECT
  USING (is_admin());

-- User points: admin can delete any
DROP POLICY IF EXISTS "Admin can delete any user points" ON user_points;
CREATE POLICY "Admin can delete any user points"
  ON user_points FOR DELETE
  USING (is_admin());

-- Admin emails: admin only
DROP POLICY IF EXISTS "Admin only access" ON admin_user_emails;
CREATE POLICY "Admin only access"
  ON admin_user_emails FOR ALL
  USING (is_admin());

-- 5. Auto-set new admin users based on email (optional backup)
CREATE OR REPLACE FUNCTION auto_set_admin()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email = 'tsiartasantreas@gmail.com' THEN
    NEW.is_admin = TRUE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_admin_on_signup
  BEFORE INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION auto_set_admin();
