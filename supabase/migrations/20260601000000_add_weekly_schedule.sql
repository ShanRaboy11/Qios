-- 20260601000000_add_weekly_schedule.sql
-- Add weekly_schedule to employee_settings if it doesn't exist

ALTER TABLE public.employee_settings 
ADD COLUMN IF NOT EXISTS weekly_schedule JSONB DEFAULT '[]'::jsonb;
