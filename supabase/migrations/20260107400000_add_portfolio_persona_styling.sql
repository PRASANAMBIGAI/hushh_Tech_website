-- Migration: Add persona_id and custom_styling columns to portfolios table
-- Purpose: Support 12 user personas and custom styling options for Hushh Folio

-- Add persona_id column to store selected persona (student, developer, etc.)
ALTER TABLE public.portfolios 
ADD COLUMN IF NOT EXISTS persona_id VARCHAR(50);

-- Add custom_styling column to store styling preferences as JSONB
-- Structure: { primaryColor, secondaryColor, fontFamily, borderRadius, cardStyle, effects: { glassmorphism, gradients, shadows, animations } }
ALTER TABLE public.portfolios 
ADD COLUMN IF NOT EXISTS custom_styling JSONB DEFAULT '{}';

-- Add comment for documentation
COMMENT ON COLUMN public.portfolios.persona_id IS 'User persona type: student, fresher, professional, executive, founder, freelancer, creative, developer, investor, academic, creator, career_changer';
COMMENT ON COLUMN public.portfolios.custom_styling IS 'Custom styling preferences: colors, fonts, border radius, card style, and visual effects';

-- Create index on persona_id for faster queries
CREATE INDEX IF NOT EXISTS idx_portfolios_persona_id ON public.portfolios(persona_id);
