-- =====================================================
-- MIGRATION SCRIPT: v1.0 to v2.0 Enhanced
-- Run this script to upgrade your existing database
-- =====================================================

-- Step 1: Create new alerts table
CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    module_no INTEGER NOT NULL,
    alert_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    value DECIMAL(10,2),
    threshold DECIMAL(10,2),
    message TEXT,
    is_cleared BOOLEAN DEFAULT FALSE,
    cleared_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 2: Create module_status table
CREATE TABLE IF NOT EXISTS module_status (
    module_no INTEGER PRIMARY KEY,
    is_online BOOLEAN DEFAULT TRUE,
    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    min_temperature DECIMAL(5,2),
    max_temperature DECIMAL(5,2),
    min_smoke DECIMAL(10,2),
    max_smoke DECIMAL(10,2),
    alert_count INTEGER DEFAULT 0
);

-- Step 3: Update logs table action_type constraint
ALTER TABLE logs DROP CONSTRAINT IF EXISTS logs_action_type_check;
ALTER TABLE logs ADD CONSTRAINT logs_action_type_check 
  CHECK (action_type IN ('LOGIN', 'LOGOUT', 'ADD_USER', 'DOWNLOAD', 'SEARCH', 'PASSWORD_RESET', 'VIEW_ALERTS', 'CLEAR_ALERT'));

-- Step 4: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_alerts_module_created ON alerts(module_no, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_cleared ON alerts(is_cleared);
CREATE INDEX IF NOT EXISTS idx_module_status_online ON module_status(is_online);

-- Step 5: Add smoke column to sensor_data if missing (for older versions)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='sensor_data' AND column_name='smoke') THEN
        ALTER TABLE sensor_data ADD COLUMN smoke DECIMAL(10,2);
    END IF;
END $$;

-- Step 6: Rename smoke_level to smoke if needed (standardization)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='sensor_data' AND column_name='smoke_level') THEN
        ALTER TABLE sensor_data RENAME COLUMN smoke_level TO smoke;
    END IF;
END $$;

-- Step 7: Initialize module_status for existing modules
INSERT INTO module_status (module_no, is_online, last_update)
SELECT DISTINCT module_no, TRUE, MAX(created_at)
FROM sensor_data
GROUP BY module_no
ON CONFLICT (module_no) DO NOTHING;

-- Step 8: Create function to auto-update module status
CREATE OR REPLACE FUNCTION update_module_status_trigger()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO module_status (module_no, is_online, last_update, min_temperature, max_temperature, min_smoke, max_smoke)
    VALUES (NEW.module_no, TRUE, NEW.created_at, NEW.temperature, NEW.temperature, NEW.smoke, NEW.smoke)
    ON CONFLICT (module_no) DO UPDATE SET
        is_online = TRUE,
        last_update = NEW.created_at,
        min_temperature = LEAST(module_status.min_temperature, NEW.temperature),
        max_temperature = GREATEST(module_status.max_temperature, NEW.temperature),
        min_smoke = LEAST(module_status.min_smoke, NEW.smoke),
        max_smoke = GREATEST(module_status.max_smoke, NEW.smoke);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 9: Create trigger on sensor_data
DROP TRIGGER IF EXISTS sensor_data_status_update ON sensor_data;
CREATE TRIGGER sensor_data_status_update
    AFTER INSERT ON sensor_data
    FOR EACH ROW
    EXECUTE FUNCTION update_module_status_trigger();

-- Step 10: Verify migration
DO $$
DECLARE
    alert_count INTEGER;
    status_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO alert_count FROM information_schema.tables WHERE table_name = 'alerts';
    SELECT COUNT(*) INTO status_count FROM information_schema.tables WHERE table_name = 'module_status';
    
    IF alert_count > 0 AND status_count > 0 THEN
        RAISE NOTICE '✅ Migration completed successfully!';
        RAISE NOTICE '✅ New tables created: alerts, module_status';
        RAISE NOTICE '✅ Indexes created for performance';
        RAISE NOTICE '✅ Triggers configured';
    ELSE
        RAISE EXCEPTION '❌ Migration failed - tables not created';
    END IF;
END $$;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- Next steps:
-- 1. Install new npm packages: npm install
-- 2. Update .env with JWT_SECRET
-- 3. Restart your server: npm start
-- 4. Test alert system and new features
-- =====================================================
