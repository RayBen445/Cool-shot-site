-- Admin users table
CREATE TABLE admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role text DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- User credits table
CREATE TABLE user_credits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  credits integer DEFAULT 0,
  unlimited boolean DEFAULT false,
  last_updated timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Credit transactions table
CREATE TABLE credit_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  transaction_type text NOT NULL CHECK (transaction_type IN ('deployment', 'redeem', 'admin_grant', 'admin_deduct')),
  description text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Redemption codes table
CREATE TABLE redemption_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credits integer NOT NULL,
  max_uses integer DEFAULT 1,
  current_uses integer DEFAULT 0,
  is_active boolean DEFAULT true,
  expires_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Redeemed codes tracking
CREATE TABLE redeemed_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code_id uuid NOT NULL REFERENCES redemption_codes(id) ON DELETE CASCADE,
  redeemed_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, code_id)
);

-- Admin notifications table
CREATE TABLE admin_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info' CHECK (type IN ('info', 'warning', 'error', 'success')),
  is_read boolean DEFAULT false,
  target_users text[] DEFAULT ARRAY[]::text[],
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- User notifications for system updates
CREATE TABLE user_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  admin_notification_id uuid REFERENCES admin_notifications(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info' CHECK (type IN ('info', 'warning', 'error', 'success')),
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE redemption_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE redeemed_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;

-- Admin users policies
CREATE POLICY "Only admins can view admin users" ON admin_users FOR SELECT USING (
  auth.uid() IN (SELECT user_id FROM admin_users)
);

-- User credits policies
CREATE POLICY "Users can view their own credits" ON user_credits FOR SELECT USING (
  auth.uid() = user_id OR auth.uid() IN (SELECT user_id FROM admin_users)
);

CREATE POLICY "Admins can update user credits" ON user_credits FOR UPDATE USING (
  auth.uid() IN (SELECT user_id FROM admin_users)
);

-- Credit transactions policies
CREATE POLICY "Users can view their own transactions" ON credit_transactions FOR SELECT USING (
  auth.uid() = user_id OR auth.uid() IN (SELECT user_id FROM admin_users)
);

CREATE POLICY "System can insert transactions" ON credit_transactions FOR INSERT WITH CHECK (true);

-- Redemption codes policies
CREATE POLICY "Anyone can read active redemption codes" ON redemption_codes FOR SELECT USING (
  is_active = true
);

CREATE POLICY "Admins can create redemption codes" ON redemption_codes FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT user_id FROM admin_users)
);

CREATE POLICY "Admins can update redemption codes" ON redemption_codes FOR UPDATE USING (
  auth.uid() IN (SELECT user_id FROM admin_users)
);

-- Redeemed codes policies
CREATE POLICY "Users can view their redeemed codes" ON redeemed_codes FOR SELECT USING (
  auth.uid() = user_id
);

CREATE POLICY "System can insert redeemed codes" ON redeemed_codes FOR INSERT WITH CHECK (true);

-- Admin notifications policies
CREATE POLICY "Only admins can view admin notifications" ON admin_notifications FOR SELECT USING (
  auth.uid() IN (SELECT user_id FROM admin_users)
);

CREATE POLICY "Admins can create notifications" ON admin_notifications FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT user_id FROM admin_users)
);

-- User notifications policies
CREATE POLICY "Users can view their own notifications" ON user_notifications FOR SELECT USING (
  auth.uid() = user_id
);

CREATE POLICY "System can insert notifications" ON user_notifications FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their notification read status" ON user_notifications FOR UPDATE USING (
  auth.uid() = user_id
);
