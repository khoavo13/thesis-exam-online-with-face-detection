-- public.answer_option definition

-- Drop table

-- DROP TABLE public.answer_option;

CREATE TABLE public.question_folder (
    id int8 NOT NULL,
    course varchar(255),
    name varchar(255),
    CONSTRAINT answer_option_pkey PRIMARY KEY (id)
);

CREATE TABLE public.question (
    id int8 NOT NULL,
    description varchar(255),
    score float8 ,
    "type" int4 ,
    solution_id int8 ,
    exam_id int8
    CONSTRAINT question_pkey PRIMARY KEY (id)
);

CREATE TABLE public.answer_option (
    id int8 NOT NULL,
    "content" varchar(255) NULL,
    question_id int8 NOT NULL,
    CONSTRAINT answer_option_pkey PRIMARY KEY (id)
);

CREATE TABLE public.users (
    id int8 NOT NULL,
    created_date date NULL,
    email varchar(255) NULL,
    face_feature bytea NULL,
    full_name varchar(255) NULL,
    "password" varchar(255) NULL,
    "role" int8 NULL,
    updated_date date NULL,
    user_number int8 NULL,
    username varchar(255) NOT NULL,
    CONSTRAINT uk_r43af9ap4edm43mmtq01oddj6 UNIQUE (username),
    CONSTRAINT users_pkey PRIMARY KEY (id)
);

-- public.answer_option foreign keys

ALTER TABLE public.answer_option ADD CONSTRAINT fkfqeqisl0e28xp3yn9bmlgkhej FOREIGN KEY (question_id) REFERENCES public.question(id);