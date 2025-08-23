CREATE TABLE public.courses (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name character varying DEFAULT ''::character varying,
  dificulty character varying DEFAULT 'low'::character varying,
  CONSTRAINT courses_pkey PRIMARY KEY (id)
);

CREATE TABLE public.levels (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  course_id bigint NOT NULL,
  title character varying DEFAULT ''::character varying,
  level_no bigint,
  CONSTRAINT levels_pkey PRIMARY KEY (id),
  CONSTRAINT levels_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id)
);

CREATE TABLE public.Cards (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  course_level_id bigint,
  content text DEFAULT ''::text,
  CONSTRAINT Cards_pkey PRIMARY KEY (id),
  CONSTRAINT Cards_course_level_id_fkey FOREIGN KEY (course_level_id) REFERENCES public.levels(id)
);
