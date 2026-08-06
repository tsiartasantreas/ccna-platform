-- ============================================================
-- Fix delete_user_account GRANT: Allow authenticated users to call it
-- The function already has internal auth check (user can only delete own account)
-- ============================================================

-- Grant execute to authenticated users (they can only delete their own account)
GRANT EXECUTE ON FUNCTION delete_user_account(UUID) TO authenticated;
