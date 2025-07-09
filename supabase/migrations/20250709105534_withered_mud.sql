/*
  # Feedback and Support Schema

  1. New Tables
    - `feedback` - Traveler feedback, complaints, suggestions
      - `id` (uuid, primary key)
      - `traveler_id` (uuid, foreign key)
      - `type` (enum)
      - `subject` (text)
      - `content` (text)
      - `priority` (enum)
      - `status` (enum)
      - `sentiment_score` (numeric)
      - `assigned_to` (uuid, foreign key, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on feedback table
    - Add appropriate policies
*/

-- Create custom types
CREATE TYPE feedback_type AS ENUM ('complaint', 'suggestion', 'ticket', 'compliment');
CREATE TYPE feedback_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE feedback_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  traveler_id uuid NOT NULL REFERENCES travelers(id) ON DELETE CASCADE,
  type feedback_type NOT NULL,
  subject text NOT NULL,
  content text NOT NULL,
  priority feedback_priority NOT NULL DEFAULT 'medium',
  status feedback_status NOT NULL DEFAULT 'open',
  sentiment_score numeric(3,2) DEFAULT 0.5 CHECK (sentiment_score >= 0 AND sentiment_score <= 1),
  assigned_to uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can read feedback"
  ON feedback
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert feedback"
  ON feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update feedback"
  ON feedback
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can delete feedback"
  ON feedback
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER feedback_updated_at
  BEFORE UPDATE ON feedback
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_feedback_traveler_id ON feedback(traveler_id);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback(type);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_priority ON feedback(priority);
CREATE INDEX IF NOT EXISTS idx_feedback_assigned_to ON feedback(assigned_to);