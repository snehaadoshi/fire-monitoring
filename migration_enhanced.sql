-- NEW FEATURE: Database Migration for Enhanced Features
-- Run this to add new columns without affecting existing data

-- Add ML confidence column
ALTER TABLE sensor_data 
ADD COLUMN IF NOT EXISTS ml_confidence DECIMAL(5,4);

-- Add anomaly detection columns
ALTER TABLE sensor_data 
ADD COLUMN IF NOT EXISTS anomaly_score DECIMAL(5,4),
ADD COLUMN IF NOT EXISTS is_anomaly BOOLEAN DEFAULT FALSE;

-- Update alerts table to support anomaly alerts
ALTER TABLE alerts 
DROP CONSTRAINT IF EXISTS alerts_action_type_check;

-- No constraint needed, alert_type is VARCHAR without restrictions

-- Create index for anomaly queries
CREATE INDEX IF NOT EXISTS idx_sensor_anomaly ON sensor_data(is_anomaly, created_at DESC);

-- Add comment
COMMENT ON COLUMN sensor_data.ml_confidence IS 'ML prediction confidence score (0-1)';
COMMENT ON COLUMN sensor_data.anomaly_score IS 'Anomaly detection score (0-1)';
COMMENT ON COLUMN sensor_data.is_anomaly IS 'Whether reading is anomalous';
