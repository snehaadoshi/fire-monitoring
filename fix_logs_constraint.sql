-- Fix for START/STOP command logging
-- Run this in your Neon PostgreSQL console

-- Step 1: Drop existing constraint
ALTER TABLE logs DROP CONSTRAINT IF EXISTS logs_action_type_check;

-- Step 2: Add new constraint with START_DEVICE and STOP_DEVICE
ALTER TABLE logs ADD CONSTRAINT logs_action_type_check 
CHECK (action_type IN (
    'LOGIN', 
    'LOGOUT', 
    'ADD_USER', 
    'DOWNLOAD', 
    'SEARCH', 
    'PASSWORD_RESET', 
    'VIEW_ALERTS', 
    'CLEAR_ALERT',
    'START_DEVICE', 
    'STOP_DEVICE'
));

-- Step 3: Verify the constraint was updated
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conname = 'logs_action_type_check';
