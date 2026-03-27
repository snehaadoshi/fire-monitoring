-- =====================================================
-- DEVICE COMMANDS TABLE MIGRATION
-- Add IoT device control support (START/STOP commands)
-- =====================================================

-- Create device_commands table
CREATE TABLE IF NOT EXISTS device_commands (
    id SERIAL PRIMARY KEY,
    module_no INTEGER DEFAULT 1,
    command VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_device_commands_module_created 
ON device_commands(module_no, created_at DESC);

-- Update logs table to support new command actions
ALTER TABLE logs DROP CONSTRAINT IF EXISTS logs_action_type_check;
ALTER TABLE logs ADD CONSTRAINT logs_action_type_check 
  CHECK (action_type IN ('LOGIN', 'LOGOUT', 'ADD_USER', 'DOWNLOAD', 'SEARCH', 
                         'PASSWORD_RESET', 'VIEW_ALERTS', 'CLEAR_ALERT', 
                         'START_DEVICE', 'STOP_DEVICE', 'DEVICE_COMMAND'));

-- Verify table creation
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'device_commands') THEN
        RAISE NOTICE '✅ device_commands table created successfully';
    ELSE
        RAISE EXCEPTION '❌ Failed to create device_commands table';
    END IF;
END $$;
