-- Allow users to get their own sessions with proper casting
CREATE OR REPLACE FUNCTION public.get_my_sessions()
RETURNS TABLE (
  id uuid,
  user_agent text,
  ip_address text,
  created_at timestamptz,
  updated_at timestamptz
) SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.user_agent,
    cast(s.ip as text) as ip_address,
    s.created_at,
    s.updated_at
  FROM auth.sessions s
  WHERE s.user_id = auth.uid()
  ORDER BY s.updated_at DESC;
END;
$$ LANGUAGE plpgsql;
