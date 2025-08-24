-- Add new columns to courses
ALTER TABLE public.courses
ADD COLUMN description text DEFAULT ''::text,
ADD COLUMN image_url text DEFAULT ''::text;


-- Add new columns to cards
ALTER TABLE public.cards
ADD COLUMN title character varying DEFAULT ''::character varying,
ADD COLUMN type character varying DEFAULT 'text'::character varying,
ADD COLUMN "order" integer DEFAULT 0;
