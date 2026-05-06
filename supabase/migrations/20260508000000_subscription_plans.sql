-- Create subscription_plans table
CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id UUID DEFAULT generate_uuid_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    badge TEXT NOT NULL,
    price_monthly TEXT NOT NULL,
    price_annually TEXT NOT NULL,
    features JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- Allow public read access to plans (for onboarding)
CREATE POLICY "Subscription plans are viewable by everyone" ON public.subscription_plans FOR SELECT USING (true);

-- Assuming only authenticated super-admins can insert/update/delete.
-- For now, allow authenticated users to modify, or you can tighten it to a specific admin role.
CREATE POLICY "Authenticated users can modify subscription plans" ON public.subscription_plans 
FOR ALL USING (auth.role() = 'authenticated');

-- Function to handle `updated_at`
CREATE OR REPLACE FUNCTION public.handle_updated_at_subscription_plans()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER tr_subscription_plans_updated_at
    BEFORE UPDATE ON public.subscription_plans
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at_subscription_plans();

-- Seed data for basic plans
INSERT INTO public.subscription_plans (id, name, color, badge, price_monthly, price_annually, features) VALUES
('b3c2d4a5-1e6f-4c8d-9b1e-0a1f2e3d4c5b', 'Basic', 'bg-[#ffc670]', 'Starter Ready', '1,499', '15,290', '{
  "customer": { "Browser-Based Ordering": true, "Text-Based AI Concierge": false, "Menu Viewing & Item Customization": true, "Real-Time Price Calculation": true, "Order Confirmation & QR Generation": true, "Order Status Viewing": true },
  "employee_ops": { "Employee Authentication": true, "QR Code Order Retrieval": true, "Order Modification & Validation": true, "Payment Confirmation": true, "Order Queue Management": true, "Transaction Logging": true },
  "inventory": { "Unit-Based Inventory Tracking": false, "Measurement-Based Inventory Tracking": false, "Automated Stock Deduction": false, "Physical Stock Input & Variance Reports": false, "Shrinkage Alerts": false },
  "analytics": { "Live Revenue Dashboard": false, "Sales Reports Generation": true, "Order Velocity Analytics": false, "Staff Activity Monitoring": false, "Cancellation & Void Monitoring": false },
  "admin_controls": { "Admin Authentication": true, "Role & Permissions Management": true }
}'),
('d1e2f3a4-b5c6-4d7e-8c9b-1a2f3e4d5c6b', 'Business', 'bg-[#ff5269]', 'Most Popular', '3,499', '35,690', '{
  "customer": { "Browser-Based Ordering": true, "Text-Based AI Concierge": true, "Menu Viewing & Item Customization": true, "Real-Time Price Calculation": true, "Order Confirmation & QR Generation": true, "Order Status Viewing": true },
  "employee_ops": { "Employee Authentication": true, "QR Code Order Retrieval": true, "Order Modification & Validation": true, "Payment Confirmation": true, "Order Queue Management": true, "Transaction Logging": true },
  "inventory": { "Unit-Based Inventory Tracking": true, "Measurement-Based Inventory Tracking": false, "Automated Stock Deduction": true, "Physical Stock Input & Variance Reports": true, "Shrinkage Alerts": true },
  "analytics": { "Live Revenue Dashboard": true, "Sales Reports Generation": true, "Order Velocity Analytics": true, "Staff Activity Monitoring": true, "Cancellation & Void Monitoring": false },
  "admin_controls": { "Admin Authentication": true, "Role & Permissions Management": true }
}'),
('f5a4b3c2-e1d0-4e8f-9a1b-2c3d4e5f6a9b', 'Enterprise', 'bg-[#18181b]', 'Maximum Power', 'Custom', 'Custom', '{
  "customer": { "Browser-Based Ordering": true, "Text-Based AI Concierge": true, "Menu Viewing & Item Customization": true, "Real-Time Price Calculation": true, "Order Confirmation & QR Generation": true, "Order Status Viewing": true },
  "employee_ops": { "Employee Authentication": true, "QR Code Order Retrieval": true, "Order Modification & Validation": true, "Payment Confirmation": true, "Order Queue Management": true, "Transaction Logging": true },
  "inventory": { "Unit-Based Inventory Tracking": true, "Measurement-Based Inventory Tracking": true, "Automated Stock Deduction": true, "Physical Stock Input & Variance Reports": true, "Shrinkage Alerts": true },
  "analytics": { "Live Revenue Dashboard": true, "Sales Reports Generation": true, "Order Velocity Analytics": true, "Staff Activity Monitoring": true, "Cancellation & Void Monitoring": true },
  "admin_controls": { "Admin Authentication": true, "Role & Permissions Management": true }
}');
