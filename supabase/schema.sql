-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create admin users table with unique constraint
CREATE TABLE admin_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CONSTRAINT admin_users_email_key UNIQUE (email)
);

-- Create products table
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT NOT NULL,
  stripe_price_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create customers table
CREATE TABLE customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CONSTRAINT customers_email_key UNIQUE (email)
);

-- Create RLS policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Products policies
CREATE POLICY "Enable read access for all users" ON products FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON products FOR DELETE USING (auth.role() = 'authenticated');

-- Customers policies
CREATE POLICY "Enable read access for authenticated users" ON customers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert for authenticated users" ON customers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for own profile" ON customers FOR UPDATE USING (auth.uid() = id);

-- Admin policies
CREATE POLICY "Enable full access for authenticated users" ON admin_users FOR ALL USING (auth.role() = 'authenticated');

-- Insert existing products data
INSERT INTO products (title, description, price, image_url) VALUES
  ('Lavender Floor cleaner', 'Lorem ipsum dituling fasm och titretuligt sasor och osade och jäktig. Vint viledes sylingar rengen porur niligen. Norsk karaoke jäjoliga planet da vägen i autor. Homösk suprapol kikang. Tävla ut operafaktisk.', 30.00, '/bucket1.png'),
  ('Lime Floor cleaner', 'Lorem ipsum dituling fasm och titretuligt sasor och osade och jäktig. Vint viledes sylingar rengen porur niligen. Norsk karaoke jäjoliga planet da vägen i autor. Homösk suprapol kikang. Tävla ut operafaktisk.', 30.00, '/bucket2.png'),
  ('Laundry Detergent', 'Lorem ipsum dituling fasm och titretuligt sasor och osade och jäktig. Vint viledes sylingar rengen porur niligen. Norsk karaoke jäjoliga planet da vägen i autor. Homösk suprapol kikang. Tävla ut operafaktisk.', 30.00, '/bucket3.png'),
  ('Pods', 'Lorem ipsum dituling fasm och titretuligt sasor och osade och jäktig. Vint viledes sylingar rengen porur niligen. Norsk karaoke jäjoliga planet da vägen i autor. Homösk suprapol kikang. Tävla ut operafaktisk.', 50.00, '/bucket4.png'),
  ('Fabric Softener', 'Lorem ipsum dituling fasm och titretuligt sasor och osade och jäktig. Vint viledes sylingar rengen porur niligen. Norsk karaoke jäjoliga planet da vägen i autor. Homösk suprapol kikang. Tävla ut operafaktisk.', 30.00, '/bucket5.png'),
  ('Multi-Surface Cleaner', 'Lorem ipsum dituling fasm och titretuligt sasor och osade och jäktig. Vint viledes sylingar rengen porur niligen. Norsk karaoke jäjoliga planet da vägen i autor. Homösk suprapol kikang. Tävla ut operafaktisk.', 30.00, '/bucket6.png'),
  ('Dish Soap', 'Lorem ipsum dituling fasm och titretuligt sasor och osade och jäktig. Vint viledes sylingar rengen porur niligen. Norsk karaoke jäjoliga planet da vägen i autor. Homösk suprapol kikang. Tävla ut operafaktisk.', 30.00, '/bucket7.png'),
  ('Stain Remover', 'Lorem ipsum dituling fasm och titretuligt sasor och osade och jäktig. Vint viledes sylingar rengen porur niligen. Norsk karaoke jäjoliga planet da vägen i autor. Homösk suprapol kikang. Tävla ut operafaktisk.', 30.00, '/bucket8.png'),
  ('Bathroom Cleaner', 'Lorem ipsum dituling fasm och titretuligt sasor och osade och jäktig. Vint viledes sylingar rengen porur niligen. Norsk karaoke jäjoliga planet da vägen i autor. Homösk suprapol kikang. Tävla ut operafaktisk.', 30.00, '/bucket9.png'),
  ('Glass Cleaner', 'Lorem ipsum dituling fasm och titretuligt sasor och osade och jäktig. Vint viledes sylingar rengen porur niligen. Norsk karaoke jäjoliga planet da vägen i autor. Homösk suprapol kikang. Tävla ut operafaktisk.', 30.00, '/bucket10.png'),
  ('Carpet Cleaner', 'Lorem ipsum dituling fasm och titretuligt sasor och osade och jäktig. Vint viledes sylingar rengen porur niligen. Norsk karaoke jäjoliga planet da vägen i autor. Homösk suprapol kikang. Tävla ut operafaktisk.', 30.00, '/bucket11.png'),
  ('Disinfectant Spray', 'Lorem ipsum dituling fasm och titretuligt sasor och osade och jäktig. Vint viledes sylingar rengen porur niligen. Norsk karaoke jäjoliga planet da vägen i autor. Homösk suprapol kikang. Tävla ut operafaktisk.', 30.00, '/bucket12.png');
