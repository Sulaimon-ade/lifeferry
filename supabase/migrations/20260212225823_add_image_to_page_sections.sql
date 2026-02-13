/*
  # Add Image Support to Page Sections

  1. Changes
    - Add `image_url` column to `page_sections` table to store section images
    - Add `image_position` column to control if image appears on left or right
  
  2. Notes
    - image_url is optional (nullable)
    - image_position defaults to 'right' for consistent layout
*/

-- Add image_url column to store section images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'page_sections' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE page_sections ADD COLUMN image_url text;
  END IF;
END $$;

-- Add image_position column to control layout (left or right)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'page_sections' AND column_name = 'image_position'
  ) THEN
    ALTER TABLE page_sections ADD COLUMN image_position text DEFAULT 'right';
  END IF;
END $$;