-- Role: cms
-- DROP ROLE cms;

CREATE ROLE cms WITH
  LOGIN
  NOSUPERUSER
  INHERIT
  NOCREATEDB
  NOCREATEROLE
  NOREPLICATION
  ENCRYPTED PASSWORD 'Ai0E6HNz38M6Rdv4ipHbu1&*GgFApO4s@5YW$$Tw^Yat2TaZv6';


-- SEQUENCE: public.admin_themes_id_seq

-- DROP SEQUENCE public.admin_themes_id_seq;

CREATE SEQUENCE public.admin_themes_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

ALTER SEQUENCE public.admin_themes_id_seq
    OWNER TO cms;

-- SEQUENCE: public.auth_admin_id_seq

-- DROP SEQUENCE public.auth_admin_id_seq;

CREATE SEQUENCE public.auth_admin_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

ALTER SEQUENCE public.auth_admin_id_seq
    OWNER TO postgres;

-- SEQUENCE: public.box_style_id_seq

-- DROP SEQUENCE public.box_style_id_seq;

CREATE SEQUENCE public.box_style_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

ALTER SEQUENCE public.box_style_id_seq
    OWNER TO cms;

-- SEQUENCE: public.categories_id_seq

-- DROP SEQUENCE public.categories_id_seq;

CREATE SEQUENCE public.categories_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

ALTER SEQUENCE public.categories_id_seq
    OWNER TO cms;

-- SEQUENCE: public.gallery_images_id_seq

-- DROP SEQUENCE public.gallery_images_id_seq;

CREATE SEQUENCE public.gallery_images_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

ALTER SEQUENCE public.gallery_images_id_seq
    OWNER TO cms;

-- SEQUENCE: public.gallery_module_id_seq

-- DROP SEQUENCE public.gallery_module_id_seq;

CREATE SEQUENCE public.gallery_module_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

ALTER SEQUENCE public.gallery_module_id_seq
    OWNER TO cms;

-- SEQUENCE: public.page_config_id_seq

-- DROP SEQUENCE public.page_config_id_seq;

CREATE SEQUENCE public.page_config_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

ALTER SEQUENCE public.page_config_id_seq
    OWNER TO cms;

-- SEQUENCE: public.pages_id_seq

-- DROP SEQUENCE public.pages_id_seq;

CREATE SEQUENCE public.pages_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

ALTER SEQUENCE public.pages_id_seq
    OWNER TO cms;

-- SEQUENCE: public.pages_to_boxes_id_seq

-- DROP SEQUENCE public.pages_to_boxes_id_seq;

CREATE SEQUENCE public.pages_to_boxes_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

ALTER SEQUENCE public.pages_to_boxes_id_seq
    OWNER TO cms;

-- SEQUENCE: public.pages_to_categories_id_seq

-- DROP SEQUENCE public.pages_to_categories_id_seq;

CREATE SEQUENCE public.pages_to_categories_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

ALTER SEQUENCE public.pages_to_categories_id_seq
    OWNER TO cms;

-- SEQUENCE: public.pages_to_config_id_seq

-- DROP SEQUENCE public.pages_to_config_id_seq;

CREATE SEQUENCE public.pages_to_config_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

ALTER SEQUENCE public.pages_to_config_id_seq
    OWNER TO cms;

-- SEQUENCE: public.public_themes_id_seq

-- DROP SEQUENCE public.public_themes_id_seq;

CREATE SEQUENCE public.public_themes_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

ALTER SEQUENCE public.public_themes_id_seq
    OWNER TO cms;

-- Table: public.admin_themes

-- DROP TABLE public.admin_themes;

CREATE TABLE public.admin_themes
(
    id integer NOT NULL DEFAULT nextval('admin_themes_id_seq'::regclass),
    title character varying COLLATE pg_catalog."default" NOT NULL,
    isdefault smallint NOT NULL,
    thumbnail character varying COLLATE pg_catalog."default",
    data text COLLATE pg_catalog."default",
    CONSTRAINT admin_themes_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.admin_themes
    OWNER to cms;

-- Table: public.auth_admin

-- DROP TABLE public.auth_admin;

CREATE TABLE public.auth_admin
(
    id integer NOT NULL DEFAULT nextval('auth_admin_id_seq'::regclass),
    email character varying COLLATE pg_catalog."default" NOT NULL,
    fullname character varying COLLATE pg_catalog."default" NOT NULL,
    fname character varying COLLATE pg_catalog."default" NOT NULL,
    lname character varying COLLATE pg_catalog."default" NOT NULL,
    password character varying COLLATE pg_catalog."default" NOT NULL,
    active smallint NOT NULL,
    CONSTRAINT id_pk PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.auth_admin
    OWNER to cms;
-- Index: email_idx

-- DROP INDEX public.email_idx;

CREATE UNIQUE INDEX email_idx
    ON public.auth_admin USING btree
    (email COLLATE pg_catalog."C" varchar_ops ASC NULLS LAST)
    INCLUDE(email)
    TABLESPACE pg_default;

-- Table: public.categories

-- DROP TABLE public.categories;

CREATE TABLE public.categories
(
    id integer NOT NULL DEFAULT nextval('categories_id_seq'::regclass),
    title character varying COLLATE pg_catalog."default" NOT NULL,
    description character varying COLLATE pg_catalog."default",
    parentid integer NOT NULL DEFAULT 0,
    CONSTRAINT categories_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.categories
    OWNER to cms;

-- Table: public.gallery_images

-- DROP TABLE public.gallery_images;

CREATE TABLE public.gallery_images
(
    id integer NOT NULL DEFAULT nextval('gallery_images_id_seq'::regclass),
    title character varying COLLATE pg_catalog."default",
    description character varying COLLATE pg_catalog."default",
    link character varying COLLATE pg_catalog."default",
    path character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT gallery_images_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.gallery_images
    OWNER to cms;

COMMENT ON COLUMN public.gallery_images.link
    IS '- the link to which the user should be redirected upon clicking on an image';

COMMENT ON COLUMN public.gallery_images.path
    IS '- path to image source';

-- Table: public.gallery_module

-- DROP TABLE public.gallery_module;

CREATE TABLE public.gallery_module
(
    id integer NOT NULL DEFAULT nextval('gallery_module_id_seq'::regclass),
    title character varying COLLATE pg_catalog."default" NOT NULL,
    type character varying COLLATE pg_catalog."default" NOT NULL,
    active smallint NOT NULL,
    CONSTRAINT gallery_module_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.gallery_module
    OWNER to cms;

-- Table: public.page_box

-- DROP TABLE public.page_box;

CREATE TABLE public.page_box
(
    id integer NOT NULL DEFAULT nextval('box_style_id_seq'::regclass),
    title character varying COLLATE pg_catalog."default" NOT NULL,
    module character varying COLLATE pg_catalog."default",
    fontsize smallint,
    fontfamily character varying COLLATE pg_catalog."default",
    textcolor character varying COLLATE pg_catalog."default",
    bgcolor character varying COLLATE pg_catalog."default",
    bgimage character varying COLLATE pg_catalog."default",
    borderwidth smallint,
    bordercolor character varying COLLATE pg_catalog."default",
    borderradius smallint,
    bgrepeat smallint,
    bgstretch smallint,
    CONSTRAINT box_style_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.page_box
    OWNER to cms;

-- Table: public.page_config

-- DROP TABLE public.page_config;

CREATE TABLE public.page_config
(
    id integer NOT NULL DEFAULT nextval('page_config_id_seq'::regclass),
    bgcolor character varying COLLATE pg_catalog."default",
    bgimage character varying COLLATE pg_catalog."default",
    fontsize smallint,
    fontfamily character varying COLLATE pg_catalog."default",
    textcolor character varying COLLATE pg_catalog."default",
    boxsizing smallint,
    bgrepeat smallint,
    bgstretch smallint,
    CONSTRAINT page_config_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.page_config
    OWNER to cms;

-- Table: public.pages

-- DROP TABLE public.pages;

CREATE TABLE public.pages
(
    id integer NOT NULL DEFAULT nextval('pages_id_seq'::regclass),
    title character varying COLLATE pg_catalog."default" NOT NULL,
    is_default smallint NOT NULL,
    publish smallint NOT NULL,
    cat_id integer,
    CONSTRAINT pages_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.pages
    OWNER to cms;

-- Table: public.pages_to_boxes

-- DROP TABLE public.pages_to_boxes;

CREATE TABLE public.pages_to_boxes
(
    id integer NOT NULL DEFAULT nextval('pages_to_boxes_id_seq'::regclass),
    page_id integer NOT NULL,
    box_id integer NOT NULL,
    CONSTRAINT pages_to_boxes_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.pages_to_boxes
    OWNER to cms;

-- Table: public.pages_to_categories

-- DROP TABLE public.pages_to_categories;

CREATE TABLE public.pages_to_categories
(
    id integer NOT NULL DEFAULT nextval('pages_to_categories_id_seq'::regclass),
    page_id integer NOT NULL,
    category_id integer NOT NULL,
    CONSTRAINT pages_to_categories_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.pages_to_categories
    OWNER to cms;

-- Table: public.pages_to_config

-- DROP TABLE public.pages_to_config;

CREATE TABLE public.pages_to_config
(
    id integer NOT NULL DEFAULT nextval('pages_to_config_id_seq'::regclass),
    page_id integer NOT NULL,
    config_id integer NOT NULL,
    CONSTRAINT pages_to_config_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.pages_to_config
    OWNER to cms;

-- Table: public.public_themes

-- DROP TABLE public.public_themes;

CREATE TABLE public.public_themes
(
    id integer NOT NULL DEFAULT nextval('public_themes_id_seq'::regclass),
    title character varying COLLATE pg_catalog."default" NOT NULL,
    bgcolor character varying COLLATE pg_catalog."default",
    bgimage character varying COLLATE pg_catalog."default",
    fontsize smallint,
    fontfamily character varying COLLATE pg_catalog."default",
    textcolor character varying COLLATE pg_catalog."default",
    isdefault smallint NOT NULL,
    thumbnail character varying COLLATE pg_catalog."default",
    boxspacing smallint,
    bgrepeat smallint,
    bgstretch smallint,
    CONSTRAINT public_themes_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.public_themes
    OWNER to cms;
