-- Create default admin user in auth.users
INSERT INTO auth.users (
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role
) VALUES (
  'admin@mercypeter.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  'authenticated',
  'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- Add the user to admin_users table
INSERT INTO admin_users (
  email,
  role
) VALUES (
  'admin@mercypeter.com',
  'admin'
) ON CONFLICT ON CONSTRAINT admin_users_email_key DO NOTHING;
