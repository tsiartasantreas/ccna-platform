-- Create RPC function for incrementing user points
CREATE OR REPLACE FUNCTION increment_points(p_user_id UUID, p_points INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE user_points
  SET total_points = total_points + p_points,
      updated_at = NOW()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
