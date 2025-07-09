/*
  # AI Conversations and Messages Schema

  1. New Tables
    - `ai_conversations` - AI conversation tracking
      - `id` (uuid, primary key)
      - `traveler_id` (uuid, foreign key)
      - `agent_id` (uuid, foreign key, optional)
      - `status` (enum)
      - `priority` (enum)
      - `sentiment_score` (numeric)
      - `last_message_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `messages` - Individual messages in conversations
      - `id` (uuid, primary key)
      - `conversation_id` (uuid, foreign key)
      - `content` (text)
      - `sender_type` (enum)
      - `sender_id` (uuid)
      - `confidence_score` (numeric, optional)
      - `requires_attention` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies
*/

-- Create custom types
CREATE TYPE conversation_status AS ENUM ('active', 'escalated', 'resolved');
CREATE TYPE conversation_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE message_sender_type AS ENUM ('ai', 'traveler', 'agent');

-- Create ai_conversations table
CREATE TABLE IF NOT EXISTS ai_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  traveler_id uuid NOT NULL REFERENCES travelers(id) ON DELETE CASCADE,
  agent_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  status conversation_status NOT NULL DEFAULT 'active',
  priority conversation_priority NOT NULL DEFAULT 'medium',
  sentiment_score numeric(3,2) DEFAULT 0.5 CHECK (sentiment_score >= 0 AND sentiment_score <= 1),
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  content text NOT NULL,
  sender_type message_sender_type NOT NULL,
  sender_id uuid NOT NULL,
  confidence_score numeric(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  requires_attention boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies for ai_conversations
CREATE POLICY "Authenticated users can read conversations"
  ON ai_conversations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert conversations"
  ON ai_conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update conversations"
  ON ai_conversations
  FOR UPDATE
  TO authenticated
  USING (true);

-- Policies for messages
CREATE POLICY "Authenticated users can read messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create triggers
CREATE TRIGGER ai_conversations_updated_at
  BEFORE UPDATE ON ai_conversations
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Function to update last_message_at when new message is added
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE ai_conversations
  SET last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update last_message_at
CREATE TRIGGER update_last_message_at
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_last_message();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_conversations_traveler_id ON ai_conversations(traveler_id);
CREATE INDEX IF NOT EXISTS idx_conversations_agent_id ON ai_conversations(agent_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON ai_conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_priority ON ai_conversations(priority);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_type ON messages(sender_type);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);