-- Re-create or Alter the table to match your JSON schema
CREATE TABLE IF NOT EXISTS system_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    actor_name TEXT,
    actor_role TEXT DEFAULT 'Super Admin',
    action_type TEXT NOT NULL, -- e.g., 'UPDATE', 'CREATE', 'DELETE'
    description TEXT NOT NULL, -- e.g., 'Updated platform currency'
    target_tenant_id UUID,     -- Optional: if change belongs to a specific tenant
    target_tenant_name TEXT,   -- Optional: 'Global System' for admin settings
    metadata JSONB,            -- To store the actual changes (before/after)
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE system_activity_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Only Super Admins can see or insert logs
DROP POLICY IF EXISTS "Admins full access" ON system_activity_logs;
CREATE POLICY "Admins full access"
ON system_activity_logs
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'super_admin'
    )
);