-- Allow users to get their own sessions
CREATE OR REPLACE FUNCTION public.get_my_sessions()
RETURNS TABLE (
  id uuid,
  user_agent text,
  ip_address text,
  created_at timestamptz,
  updated_at timestamptz
) SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.user_agent,
    s.ip,
    s.created_at,
    s.updated_at
  FROM auth.sessions s
  WHERE s.user_id = auth.uid()
  ORDER BY s.updated_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Allow users to revoke their own sessions (except the current one if desired, though we allow revoking any)
CREATE OR REPLACE FUNCTION public.revoke_session(session_id uuid)
RETURNS void SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM auth.sessions
  WHERE id = session_id AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql;
