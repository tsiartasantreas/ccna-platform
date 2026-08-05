-- ============================================================
-- Account Deletion Function
-- ============================================================
-- This function deletes all user data and the auth account

CREATE OR REPLACE FUNCTION delete_user_account(target_user_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Verify the user is deleting their own account (or is admin)
  IF auth.uid() != target_user_id AND NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE
  ) THEN
    RAISE EXCEPTION 'Unauthorized: cannot delete another user''s account';
  END IF;

  -- Delete user data from all tables
  DELETE FROM lesson_progress WHERE user_id = target_user_id;
  DELETE FROM quiz_scores WHERE user_id = target_user_id;
  DELETE FROM user_points WHERE user_id = target_user_id;
  DELETE FROM admin_user_emails WHERE user_id = target_user_id;
  DELETE FROM profiles WHERE id = target_user_id;

  -- Delete the auth user (this prevents future login)
  DELETE FROM auth.users WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_user_account(UUID) TO authenticated;
