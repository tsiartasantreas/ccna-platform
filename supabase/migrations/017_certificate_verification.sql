-- ============================================================
-- Certificate Verification System
-- ============================================================

-- Create certificate_verifications table
CREATE TABLE IF NOT EXISTS certificate_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  verification_code VARCHAR(20) NOT NULL UNIQUE,
  user_name TEXT NOT NULL,
  user_email TEXT,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  quiz_scores JSONB,
  total_score NUMERIC(5,2),
  modules_completed INTEGER DEFAULT 6,
  is_valid BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for fast lookups
CREATE INDEX idx_certificate_verifications_code ON certificate_verifications(verification_code);
CREATE INDEX idx_certificate_verifications_user ON certificate_verifications(user_id);

-- Enable RLS
ALTER TABLE certificate_verifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can read (for verification page)
CREATE POLICY "Anyone can verify certificates"
  ON certificate_verifications FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only authenticated users can insert (for certificate generation)
CREATE POLICY "Users can create own certificates"
  ON certificate_verifications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Admin can update (to invalidate certificates)
CREATE POLICY "Admin can update certificates"
  ON certificate_verifications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Function to generate unique verification code
CREATE OR REPLACE FUNCTION generate_verification_code()
RETURNS VARCHAR(20) AS $$
DECLARE
  code VARCHAR(20);
  exists_count INTEGER;
BEGIN
  LOOP
    -- Generate code like NL-XXXX-XXXX (NL = NetworkLearn)
    code := 'NL-' ||
            UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4)) || '-' ||
            UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4));

    -- Check if code already exists
    SELECT COUNT(*) INTO exists_count
    FROM certificate_verifications
    WHERE verification_code = code;

    -- Exit loop if code is unique
    EXIT WHEN exists_count = 0;
  END LOOP;

  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Function to create certificate verification record
CREATE OR REPLACE FUNCTION create_certificate_verification(
  p_user_id UUID,
  p_user_name TEXT,
  p_user_email TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  v_verification_code VARCHAR(20);
  v_quiz_scores JSONB;
  v_total_score NUMERIC(5,2);
  v_result JSON;
BEGIN
  -- Verify caller is the user
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Check if user has already generated a certificate
  IF EXISTS (SELECT 1 FROM certificate_verifications WHERE user_id = p_user_id AND is_valid = true) THEN
    -- Return existing certificate
    SELECT json_build_object(
      'id', cv.id,
      'verification_code', cv.verification_code,
      'user_name', cv.user_name,
      'issued_at', cv.issued_at,
      'quiz_scores', cv.quiz_scores,
      'total_score', cv.total_score,
      'is_valid', cv.is_valid
    ) INTO v_result
    FROM certificate_verifications cv
    WHERE cv.user_id = p_user_id AND cv.is_valid = true
    LIMIT 1;

    RETURN v_result;
  END IF;

  -- Generate unique verification code
  v_verification_code := generate_verification_code();

  -- Get quiz scores
  SELECT json_agg(
    json_build_object(
      'module_number', module_number,
      'score', score,
      'attempt_number', attempt_number
    )
  ) INTO v_quiz_scores
  FROM (
    SELECT DISTINCT ON (module_number)
      module_number,
      score,
      attempt_number
    FROM quiz_scores
    WHERE user_id = p_user_id
    ORDER BY module_number, score DESC
  ) best_scores;

  -- Calculate total score
  SELECT COALESCE(AVG(score), 0) INTO v_total_score
  FROM (
    SELECT DISTINCT ON (module_number) score
    FROM quiz_scores
    WHERE user_id = p_user_id
    ORDER BY module_number, score DESC
  ) scores;

  -- Insert certificate record
  INSERT INTO certificate_verifications (
    user_id,
    verification_code,
    user_name,
    user_email,
    quiz_scores,
    total_score
  ) VALUES (
    p_user_id,
    v_verification_code,
    p_user_name,
    p_user_email,
    v_quiz_scores,
    v_total_score
  );

  -- Return the created certificate
  SELECT json_build_object(
    'id', cv.id,
    'verification_code', cv.verification_code,
    'user_name', cv.user_name,
    'issued_at', cv.issued_at,
    'quiz_scores', cv.quiz_scores,
    'total_score', cv.total_score,
    'is_valid', cv.is_valid
  ) INTO v_result
  FROM certificate_verifications cv
  WHERE cv.verification_code = v_verification_code;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify a certificate
CREATE OR REPLACE FUNCTION verify_certificate(p_verification_code VARCHAR(20))
RETURNS JSON AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_build_object(
    'is_valid', cv.is_valid,
    'user_name', cv.user_name,
    'issued_at', cv.issued_at,
    'quiz_scores', cv.quiz_scores,
    'total_score', cv.total_score,
    'modules_completed', cv.modules_completed,
    'verification_code', cv.verification_code
  ) INTO v_result
  FROM certificate_verifications cv
  WHERE cv.verification_code = p_verification_code;

  IF v_result IS NULL THEN
    RETURN json_build_object(
      'is_valid', false,
      'error', 'Certificate not found'
    );
  END IF;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION create_certificate_verification(UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION verify_certificate(VARCHAR(20)) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION generate_verification_code() TO authenticated;
