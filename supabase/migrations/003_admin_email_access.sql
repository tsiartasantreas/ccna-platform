-- Create admin-only email table (separate from profiles for security)
CREATE TABLE IF NOT EXISTS admin_user_emails (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email_encrypted TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE admin_user_emails ENABLE ROW LEVEL SECURITY;

-- Only admin can access this table
CREATE POLICY "Admin only access"
  ON admin_user_emails FOR ALL
  USING (auth.jwt() ->> 'email' = 'tsiartasantreas@gmail.com');

-- Function to sync email to admin table on user creation
CREATE OR REPLACE FUNCTION sync_user_email()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO admin_user_emails (user_id, email_encrypted)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (user_id) DO UPDATE SET email_encrypted = NEW.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to sync email when profile is created/updated
CREATE TRIGGER on_profile_email_sync
  AFTER INSERT OR UPDATE OF email ON profiles
  FOR EACH ROW
  WHEN (NEW.email IS NOT NULL)
  EXECUTE FUNCTION sync_user_email();

-- Also sync existing users
INSERT INTO admin_user_emails (user_id, email_encrypted)
SELECT id, email FROM profiles WHERE email IS NOT NULL
ON CONFLICT (user_id) DO NOTHING;
