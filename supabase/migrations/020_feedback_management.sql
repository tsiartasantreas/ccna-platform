-- ============================================================
-- Feedback Management System
-- Add is_approved column and admin functions
-- ============================================================

-- Add is_approved column to module_feedback
ALTER TABLE module_feedback ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE;

-- Update existing feedback to be approved by default
UPDATE module_feedback SET is_approved = TRUE WHERE is_approved IS NULL;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_module_feedback_approved ON module_feedback(is_approved);

-- Update RLS policies for module_feedback
DROP POLICY IF EXISTS "Anyone can read feedback" ON module_feedback;
DROP POLICY IF EXISTS "feedback_select_policy" ON module_feedback;

-- Only show approved feedback to public
CREATE POLICY "Public can read approved feedback"
  ON module_feedback FOR SELECT
  TO anon, authenticated
  USING (is_approved = TRUE);

-- Admin can read all feedback
CREATE POLICY "Admin can read all feedback"
  ON module_feedback FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Admin can update feedback (approve/reject)
CREATE POLICY "Admin can update feedback"
  ON module_feedback FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Admin can delete feedback
CREATE POLICY "Admin can delete feedback"
  ON module_feedback FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Function to approve/reject feedback
CREATE OR REPLACE FUNCTION admin_update_feedback_status(
  p_feedback_id UUID,
  p_is_approved BOOLEAN
)
RETURNS VOID AS $$
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND is_admin = true
  ) THEN
    RAISE EXCEPTION 'Unauthorized: not an admin';
  END IF;

  -- Update feedback status
  UPDATE module_feedback
  SET is_approved = p_is_approved
  WHERE id = p_feedback_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete feedback
CREATE OR REPLACE FUNCTION admin_delete_feedback(
  p_feedback_id UUID
)
RETURNS VOID AS $$
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND is_admin = true
  ) THEN
    RAISE EXCEPTION 'Unauthorized: not an admin';
  END IF;

  -- Delete feedback
  DELETE FROM module_feedback
  WHERE id = p_feedback_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update admin_get_all_data to include all feedback (approved and pending)
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

-- Grant permissions
GRANT EXECUTE ON FUNCTION admin_update_feedback_status(UUID, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION admin_delete_feedback(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION admin_get_all_data() TO authenticated;
