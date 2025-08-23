-- Add fields for quiz cards
ALTER TABLE cards 
ADD COLUMN option_a text,
ADD COLUMN option_b text,
ADD COLUMN option_c text,
ADD COLUMN option_d text,
ADD COLUMN correct_answer text CHECK (correct_answer IN ('A', 'B', 'C', 'D'));
