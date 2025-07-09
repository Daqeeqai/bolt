/*
  # Travelers Management Schema

  1. New Tables
    - `travelers` - Traveler information and bookings
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `phone` (text, optional)
      - `booking_id` (text, unique)
      - `destination` (text)
      - `travel_dates` (jsonb)
      - `status` (enum)
      - `preferences` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on travelers table
    - Add policies for authenticated users
*/

-- Create custom types
CREATE TYPE traveler_status AS ENUM ('pre_departure', 'traveling', 'completed');

-- Create travelers table
CREATE TABLE IF NOT EXISTS travelers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  booking_id text UNIQUE NOT NULL,
  destination text NOT NULL,
  travel_dates jsonb NOT NULL DEFAULT '{}',
  status traveler_status NOT NULL DEFAULT 'pre_departure',
  preferences jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE travelers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can read travelers"
  ON travelers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert travelers"
  ON travelers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update travelers"
  ON travelers
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can delete travelers"
  ON travelers
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER travelers_updated_at
  BEFORE UPDATE ON travelers
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_travelers_email ON travelers(email);
CREATE INDEX IF NOT EXISTS idx_travelers_booking_id ON travelers(booking_id);
CREATE INDEX IF NOT EXISTS idx_travelers_status ON travelers(status);
CREATE INDEX IF NOT EXISTS idx_travelers_destination ON travelers(destination);