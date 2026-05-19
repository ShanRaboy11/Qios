-- Create system_activity_logs table
CREATE TABLE IF NOT EXISTS system_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE system_activity_logs ENABLE ROW LEVEL SECURITY;

-- Policies policies
DROP POLICY IF EXISTS "Admins can view system activity logs" ON system_activity_logs;
CREATE POLICY "Admins can view system activity logs"
ON system_activity_logs FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'super_admin'
    )
);

DROP POLICY IF EXISTS "Admins can insert system activity logs" ON system_activity_logs;
CREATE POLICY "Admins can insert system activity logs"
ON system_activity_logs FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'super_admin'
    )
);