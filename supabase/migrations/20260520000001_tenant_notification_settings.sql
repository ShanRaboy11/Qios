-- add tenant notification preferences to settings jsonb
UPDATE public.tenants
SET settings = COALESCE(settings, '{}'::jsonb) || jsonb_build_object(
  'receive_security_alerts', COALESCE((settings->>'receive_security_alerts')::boolean, true),
  'receive_daily_sales_summary', COALESCE((settings->>'receive_daily_sales_summary')::boolean, true),
  'receive_low_stock_alerts', COALESCE((settings->>'receive_low_stock_alerts')::boolean, true),
  'receive_staff_overtime_alerts', COALESCE((settings->>'receive_staff_overtime_alerts')::boolean, false)
)
WHERE TRUE;

COMMENT ON COLUMN public.tenants.settings IS 'Stores operational preferences, notification settings, and tenant-level configuration.';
