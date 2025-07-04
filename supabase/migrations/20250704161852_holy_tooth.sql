/*
  # Add attendees columns to events table

  1. Changes
    - Add `max_attendees` column to events table (nullable integer, default null)
    - Add `current_attendees` column to events table (non-nullable integer, default 0)
  
  2. Notes
    - `max_attendees` is nullable to allow events without attendance limits
    - `current_attendees` defaults to 0 and tracks actual registrations
    - Added check constraint to ensure current_attendees doesn't exceed max_attendees when max_attendees is set
*/

-- Add max_attendees column (nullable, for events that may not have attendance limits)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'max_attendees'
  ) THEN
    ALTER TABLE events ADD COLUMN max_attendees integer DEFAULT NULL;
  END IF;
END $$;

-- Add current_attendees column (non-nullable, defaults to 0)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'current_attendees'
  ) THEN
    ALTER TABLE events ADD COLUMN current_attendees integer DEFAULT 0 NOT NULL;
  END IF;
END $$;

-- Add check constraint to ensure current_attendees doesn't exceed max_attendees when max_attendees is set
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'events' AND constraint_name = 'events_attendees_check'
  ) THEN
    ALTER TABLE events ADD CONSTRAINT events_attendees_check 
    CHECK (max_attendees IS NULL OR current_attendees <= max_attendees);
  END IF;
END $$;

-- Add check constraint to ensure current_attendees is non-negative
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'events' AND constraint_name = 'events_current_attendees_check'
  ) THEN
    ALTER TABLE events ADD CONSTRAINT events_current_attendees_check 
    CHECK (current_attendees >= 0);
  END IF;
END $$;