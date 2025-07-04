/*
  # Remove event attendees functionality

  1. Drop Tables
    - Drop event_attendees table and related functionality
  
  2. Remove Functions
    - Remove attendee count update function and trigger
  
  3. Update Events Table
    - Remove current_attendees column as it's no longer needed
*/

-- Drop trigger first
DROP TRIGGER IF EXISTS update_event_attendee_count ON event_attendees;

-- Drop function
DROP FUNCTION IF EXISTS update_attendee_count();

-- Drop event_attendees table
DROP TABLE IF EXISTS event_attendees;

-- Remove current_attendees column from events table
ALTER TABLE events DROP COLUMN IF EXISTS current_attendees;

-- Remove max_attendees column as well since we're not tracking attendees
ALTER TABLE events DROP COLUMN IF EXISTS max_attendees;