/*
  # Create videos table

  1. New Tables
    - `videos`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `description` (text, nullable)
      - `file_url` (text, not null)
      - `thumbnail_url` (text, nullable)
      - `duration` (integer, nullable) - duration in seconds
      - `genre` (text, nullable)
      - `year` (integer, nullable)
      - `admin_id` (uuid, references auth.users)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `videos` table
    - Add policy for authenticated users to read all videos
    - Add policy for admins to manage videos
    - Add policy for public read access (for unauthenticated browsing)

  3. Storage
    - Create storage buckets for videos and thumbnails
*/

CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  file_url text NOT NULL,
  thumbnail_url text,
  duration integer, -- duration in seconds
  genre text,
  year integer,
  admin_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read videos"
  ON videos
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can insert videos"
  ON videos
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins can update videos"
  ON videos
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete videos"
  ON videos
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid()
    )
  );

-- Update updated_at on video changes
CREATE TRIGGER update_videos_updated_at
  BEFORE UPDATE ON videos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create storage buckets (these will be created via Supabase dashboard)
-- Videos bucket: 'videos'
-- Thumbnails bucket: 'thumbnails'