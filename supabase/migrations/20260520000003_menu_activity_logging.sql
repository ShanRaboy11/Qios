-- =============================================================================
-- MENU ACTIVITY LOGGING TRIGGERS
-- =============================================================================
-- This migration adds triggers to automatically log create, update, and delete
-- operations on menu_items and categories tables to system_activity_logs.

-- Helper function to get actor name from user ID
CREATE OR REPLACE FUNCTION get_actor_info(user_id UUID)
RETURNS TABLE(actor_name TEXT, actor_role TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT p.full_name, p.role::TEXT
    FROM profiles p
    WHERE p.id = user_id
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- CATEGORIES TABLE TRIGGERS
-- =============================================================================

-- Function to log category creation
CREATE OR REPLACE FUNCTION log_category_creation()
RETURNS TRIGGER AS $$
DECLARE
    v_actor_id UUID;
    v_actor_name TEXT;
    v_actor_role TEXT;
BEGIN
    v_actor_id := (auth.jwt() ->> 'sub')::uuid;
    
    -- Get actor info from profiles
    SELECT actor_name, actor_role INTO v_actor_name, v_actor_role
    FROM get_actor_info(v_actor_id);
    
    IF v_actor_name IS NULL THEN
        v_actor_name := 'Unknown User';
    END IF;
    IF v_actor_role IS NULL THEN
        v_actor_role := 'Unknown';
    END IF;
    
    INSERT INTO system_activity_logs (
        actor_id,
        actor_name,
        actor_role,
        action_type,
        description,
        target_tenant_id,
        target_tenant_name,
        metadata
    ) VALUES (
        v_actor_id,
        v_actor_name,
        v_actor_role,
        'CREATE',
        'Created menu category: ' || NEW.name,
        NEW.tenant_id,
        (SELECT business_name FROM tenants WHERE id = NEW.tenant_id),
        jsonb_build_object(
            'table', 'categories',
            'record_id', NEW.id,
            'name', NEW.name,
            'icon', NEW.icon,
            'display_order', NEW.display_order
        )
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log category updates
CREATE OR REPLACE FUNCTION log_category_update()
RETURNS TRIGGER AS $$
DECLARE
    v_actor_id UUID;
    v_actor_name TEXT;
    v_actor_role TEXT;
    v_changes JSONB;
BEGIN
    -- Only log if something actually changed
    IF OLD.* IS NOT DISTINCT FROM NEW.* THEN
        RETURN NEW;
    END IF;
    
    v_actor_id := (auth.jwt() ->> 'sub')::uuid;
    
    -- Get actor info from profiles
    SELECT actor_name, actor_role INTO v_actor_name, v_actor_role
    FROM get_actor_info(v_actor_id);
    
    IF v_actor_name IS NULL THEN
        v_actor_name := 'Unknown User';
    END IF;
    IF v_actor_role IS NULL THEN
        v_actor_role := 'Unknown';
    END IF;
    
    -- Build changes object
    v_changes := jsonb_build_object();
    IF OLD.name IS DISTINCT FROM NEW.name THEN
        v_changes := v_changes || jsonb_build_object('name', jsonb_build_object('old', OLD.name, 'new', NEW.name));
    END IF;
    IF OLD.icon IS DISTINCT FROM NEW.icon THEN
        v_changes := v_changes || jsonb_build_object('icon', jsonb_build_object('old', OLD.icon, 'new', NEW.icon));
    END IF;
    IF OLD.display_order IS DISTINCT FROM NEW.display_order THEN
        v_changes := v_changes || jsonb_build_object('display_order', jsonb_build_object('old', OLD.display_order, 'new', NEW.display_order));
    END IF;
    
    INSERT INTO system_activity_logs (
        actor_id,
        actor_name,
        actor_role,
        action_type,
        description,
        target_tenant_id,
        target_tenant_name,
        metadata
    ) VALUES (
        v_actor_id,
        v_actor_name,
        v_actor_role,
        'UPDATE',
        'Updated menu category: ' || NEW.name,
        NEW.tenant_id,
        (SELECT business_name FROM tenants WHERE id = NEW.tenant_id),
        jsonb_build_object(
            'table', 'categories',
            'record_id', NEW.id,
            'changes', v_changes
        )
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log category deletion
CREATE OR REPLACE FUNCTION log_category_deletion()
RETURNS TRIGGER AS $$
DECLARE
    v_actor_id UUID;
    v_actor_name TEXT;
    v_actor_role TEXT;
BEGIN
    v_actor_id := (auth.jwt() ->> 'sub')::uuid;
    
    -- Get actor info from profiles
    SELECT actor_name, actor_role INTO v_actor_name, v_actor_role
    FROM get_actor_info(v_actor_id);
    
    IF v_actor_name IS NULL THEN
        v_actor_name := 'Unknown User';
    END IF;
    IF v_actor_role IS NULL THEN
        v_actor_role := 'Unknown';
    END IF;
    
    INSERT INTO system_activity_logs (
        actor_id,
        actor_name,
        actor_role,
        action_type,
        description,
        target_tenant_id,
        target_tenant_name,
        metadata
    ) VALUES (
        v_actor_id,
        v_actor_name,
        v_actor_role,
        'DELETE',
        'Deleted menu category: ' || OLD.name,
        OLD.tenant_id,
        (SELECT business_name FROM tenants WHERE id = OLD.tenant_id),
        jsonb_build_object(
            'table', 'categories',
            'record_id', OLD.id,
            'name', OLD.name,
            'icon', OLD.icon,
            'display_order', OLD.display_order
        )
    );
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS trg_log_category_creation ON public.categories;
DROP TRIGGER IF EXISTS trg_log_category_update ON public.categories;
DROP TRIGGER IF EXISTS trg_log_category_deletion ON public.categories;

-- Create category triggers
CREATE TRIGGER trg_log_category_creation
    AFTER INSERT ON public.categories
    FOR EACH ROW EXECUTE FUNCTION log_category_creation();

CREATE TRIGGER trg_log_category_update
    AFTER UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION log_category_update();

CREATE TRIGGER trg_log_category_deletion
    AFTER DELETE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION log_category_deletion();

-- =============================================================================
-- MENU_ITEMS TABLE TRIGGERS
-- =============================================================================

-- Function to log menu item creation
CREATE OR REPLACE FUNCTION log_menu_item_creation()
RETURNS TRIGGER AS $$
DECLARE
    v_actor_id UUID;
    v_actor_name TEXT;
    v_actor_role TEXT;
BEGIN
    v_actor_id := (auth.jwt() ->> 'sub')::uuid;
    
    -- Get actor info from profiles
    SELECT actor_name, actor_role INTO v_actor_name, v_actor_role
    FROM get_actor_info(v_actor_id);
    
    IF v_actor_name IS NULL THEN
        v_actor_name := 'Unknown User';
    END IF;
    IF v_actor_role IS NULL THEN
        v_actor_role := 'Unknown';
    END IF;
    
    INSERT INTO system_activity_logs (
        actor_id,
        actor_name,
        actor_role,
        action_type,
        description,
        target_tenant_id,
        target_tenant_name,
        metadata
    ) VALUES (
        v_actor_id,
        v_actor_name,
        v_actor_role,
        'CREATE',
        'Created menu item: ' || NEW.name,
        NEW.tenant_id,
        (SELECT business_name FROM tenants WHERE id = NEW.tenant_id),
        jsonb_build_object(
            'table', 'menu_items',
            'record_id', NEW.id,
            'name', NEW.name,
            'category_id', NEW.category_id,
            'price', NEW.price,
            'is_available', NEW.is_available,
            'description', NEW.description,
            'image_url', NEW.image_url
        )
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log menu item updates
CREATE OR REPLACE FUNCTION log_menu_item_update()
RETURNS TRIGGER AS $$
DECLARE
    v_actor_id UUID;
    v_actor_name TEXT;
    v_actor_role TEXT;
    v_changes JSONB;
BEGIN
    -- Only log if something actually changed
    IF OLD.* IS NOT DISTINCT FROM NEW.* THEN
        RETURN NEW;
    END IF;
    
    v_actor_id := (auth.jwt() ->> 'sub')::uuid;
    
    -- Get actor info from profiles
    SELECT actor_name, actor_role INTO v_actor_name, v_actor_role
    FROM get_actor_info(v_actor_id);
    
    IF v_actor_name IS NULL THEN
        v_actor_name := 'Unknown User';
    END IF;
    IF v_actor_role IS NULL THEN
        v_actor_role := 'Unknown';
    END IF;
    
    -- Build changes object
    v_changes := jsonb_build_object();
    IF OLD.name IS DISTINCT FROM NEW.name THEN
        v_changes := v_changes || jsonb_build_object('name', jsonb_build_object('old', OLD.name, 'new', NEW.name));
    END IF;
    IF OLD.price IS DISTINCT FROM NEW.price THEN
        v_changes := v_changes || jsonb_build_object('price', jsonb_build_object('old', OLD.price, 'new', NEW.price));
    END IF;
    IF OLD.is_available IS DISTINCT FROM NEW.is_available THEN
        v_changes := v_changes || jsonb_build_object('is_available', jsonb_build_object('old', OLD.is_available, 'new', NEW.is_available));
    END IF;
    IF OLD.description IS DISTINCT FROM NEW.description THEN
        v_changes := v_changes || jsonb_build_object('description', jsonb_build_object('old', OLD.description, 'new', NEW.description));
    END IF;
    IF OLD.image_url IS DISTINCT FROM NEW.image_url THEN
        v_changes := v_changes || jsonb_build_object('image_url', jsonb_build_object('old', OLD.image_url, 'new', NEW.image_url));
    END IF;
    IF OLD.category_id IS DISTINCT FROM NEW.category_id THEN
        v_changes := v_changes || jsonb_build_object('category_id', jsonb_build_object('old', OLD.category_id, 'new', NEW.category_id));
    END IF;
    IF OLD.addons_enabled IS DISTINCT FROM NEW.addons_enabled THEN
        v_changes := v_changes || jsonb_build_object('addons_enabled', jsonb_build_object('old', OLD.addons_enabled, 'new', NEW.addons_enabled));
    END IF;
    IF OLD.addons IS DISTINCT FROM NEW.addons THEN
        v_changes := v_changes || jsonb_build_object('addons', jsonb_build_object('old', OLD.addons, 'new', NEW.addons));
    END IF;
    IF OLD.sizes IS DISTINCT FROM NEW.sizes THEN
        v_changes := v_changes || jsonb_build_object('sizes', jsonb_build_object('old', OLD.sizes, 'new', NEW.sizes));
    END IF;
    
    INSERT INTO system_activity_logs (
        actor_id,
        actor_name,
        actor_role,
        action_type,
        description,
        target_tenant_id,
        target_tenant_name,
        metadata
    ) VALUES (
        v_actor_id,
        v_actor_name,
        v_actor_role,
        'UPDATE',
        'Updated menu item: ' || NEW.name,
        NEW.tenant_id,
        (SELECT business_name FROM tenants WHERE id = NEW.tenant_id),
        jsonb_build_object(
            'table', 'menu_items',
            'record_id', NEW.id,
            'changes', v_changes
        )
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log menu item deletion
CREATE OR REPLACE FUNCTION log_menu_item_deletion()
RETURNS TRIGGER AS $$
DECLARE
    v_actor_id UUID;
    v_actor_name TEXT;
    v_actor_role TEXT;
BEGIN
    v_actor_id := (auth.jwt() ->> 'sub')::uuid;
    
    -- Get actor info from profiles
    SELECT actor_name, actor_role INTO v_actor_name, v_actor_role
    FROM get_actor_info(v_actor_id);
    
    IF v_actor_name IS NULL THEN
        v_actor_name := 'Unknown User';
    END IF;
    IF v_actor_role IS NULL THEN
        v_actor_role := 'Unknown';
    END IF;
    
    INSERT INTO system_activity_logs (
        actor_id,
        actor_name,
        actor_role,
        action_type,
        description,
        target_tenant_id,
        target_tenant_name,
        metadata
    ) VALUES (
        v_actor_id,
        v_actor_name,
        v_actor_role,
        'DELETE',
        'Deleted menu item: ' || OLD.name,
        OLD.tenant_id,
        (SELECT business_name FROM tenants WHERE id = OLD.tenant_id),
        jsonb_build_object(
            'table', 'menu_items',
            'record_id', OLD.id,
            'name', OLD.name,
            'category_id', OLD.category_id,
            'price', OLD.price,
            'is_available', OLD.is_available,
            'description', OLD.description,
            'image_url', OLD.image_url
        )
    );
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS trg_log_menu_item_creation ON public.menu_items;
DROP TRIGGER IF EXISTS trg_log_menu_item_update ON public.menu_items;
DROP TRIGGER IF EXISTS trg_log_menu_item_deletion ON public.menu_items;

-- Create menu item triggers
CREATE TRIGGER trg_log_menu_item_creation
    AFTER INSERT ON public.menu_items
    FOR EACH ROW EXECUTE FUNCTION log_menu_item_creation();

CREATE TRIGGER trg_log_menu_item_update
    AFTER UPDATE ON public.menu_items
    FOR EACH ROW EXECUTE FUNCTION log_menu_item_update();

CREATE TRIGGER trg_log_menu_item_deletion
    AFTER DELETE ON public.menu_items
    FOR EACH ROW EXECUTE FUNCTION log_menu_item_deletion();

