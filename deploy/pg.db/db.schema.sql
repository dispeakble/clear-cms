--
-- PostgreSQL database dump
--

-- Dumped from database version 11.11
-- Dumped by pg_dump version 12.5

-- Started on 2021-02-17 21:53:05 UTC

CREATE ROLE cms WITH
  LOGIN
  NOSUPERUSER
  INHERIT
  CREATEDB
  NOCREATEROLE
  NOREPLICATION
  ENCRYPTED PASSWORD 'md5435aae228b373a0313b9d3b45756ab18';

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 196 (class 1259 OID 16451)
-- Name: admin_themes_id_seq; Type: SEQUENCE; Schema: public; Owner: cms
--

CREATE DATABASE cms
    WITH
    OWNER = cms
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    CONNECTION LIMIT = -1;

CREATE SEQUENCE public.admin_themes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.admin_themes_id_seq OWNER TO cms;

SET default_tablespace = '';

--
-- TOC entry 208 (class 1259 OID 16475)
-- Name: admin_themes; Type: TABLE; Schema: public; Owner: cms
--

CREATE TABLE public.admin_themes (
    id integer DEFAULT nextval('public.admin_themes_id_seq'::regclass) NOT NULL,
    title character varying NOT NULL,
    isdefault smallint NOT NULL,
    thumbnail character varying,
    data text
);


ALTER TABLE public.admin_themes OWNER TO cms;

--
-- TOC entry 197 (class 1259 OID 16453)
-- Name: auth_admin_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.auth_admin_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.auth_admin_id_seq OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 16484)
-- Name: auth_admin; Type: TABLE; Schema: public; Owner: cms
--

CREATE TABLE public.auth_admin (
    id integer DEFAULT nextval('public.auth_admin_id_seq'::regclass) NOT NULL,
    email character varying NOT NULL,
    fullname character varying NOT NULL,
    fname character varying NOT NULL,
    lname character varying NOT NULL,
    password character varying NOT NULL,
    active smallint NOT NULL
);


ALTER TABLE public.auth_admin OWNER TO cms;

--
-- TOC entry 198 (class 1259 OID 16455)
-- Name: box_style_id_seq; Type: SEQUENCE; Schema: public; Owner: cms
--

CREATE SEQUENCE public.box_style_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.box_style_id_seq OWNER TO cms;

--
-- TOC entry 199 (class 1259 OID 16457)
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: cms
--

CREATE SEQUENCE public.categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.categories_id_seq OWNER TO cms;

--
-- TOC entry 210 (class 1259 OID 16494)
-- Name: categories; Type: TABLE; Schema: public; Owner: cms
--

CREATE TABLE public.categories (
    id integer DEFAULT nextval('public.categories_id_seq'::regclass) NOT NULL,
    title character varying NOT NULL,
    description character varying,
    parentid integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.categories OWNER TO cms;

--
-- TOC entry 200 (class 1259 OID 16459)
-- Name: gallery_images_id_seq; Type: SEQUENCE; Schema: public; Owner: cms
--

CREATE SEQUENCE public.gallery_images_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.gallery_images_id_seq OWNER TO cms;

--
-- TOC entry 211 (class 1259 OID 16504)
-- Name: gallery_images; Type: TABLE; Schema: public; Owner: cms
--

CREATE TABLE public.gallery_images (
    id integer DEFAULT nextval('public.gallery_images_id_seq'::regclass) NOT NULL,
    title character varying,
    description character varying,
    link character varying,
    path character varying NOT NULL
);


ALTER TABLE public.gallery_images OWNER TO cms;

--
-- TOC entry 3016 (class 0 OID 0)
-- Dependencies: 211
-- Name: COLUMN gallery_images.link; Type: COMMENT; Schema: public; Owner: cms
--

COMMENT ON COLUMN public.gallery_images.link IS '- the link to which the user should be redirected upon clicking on an image';


--
-- TOC entry 3017 (class 0 OID 0)
-- Dependencies: 211
-- Name: COLUMN gallery_images.path; Type: COMMENT; Schema: public; Owner: cms
--

COMMENT ON COLUMN public.gallery_images.path IS '- path to image source';


--
-- TOC entry 201 (class 1259 OID 16461)
-- Name: gallery_module_id_seq; Type: SEQUENCE; Schema: public; Owner: cms
--

CREATE SEQUENCE public.gallery_module_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.gallery_module_id_seq OWNER TO cms;

--
-- TOC entry 212 (class 1259 OID 16513)
-- Name: gallery_module; Type: TABLE; Schema: public; Owner: cms
--

CREATE TABLE public.gallery_module (
    id integer DEFAULT nextval('public.gallery_module_id_seq'::regclass) NOT NULL,
    title character varying NOT NULL,
    type character varying NOT NULL,
    active smallint NOT NULL
);


ALTER TABLE public.gallery_module OWNER TO cms;

--
-- TOC entry 213 (class 1259 OID 16522)
-- Name: page_box; Type: TABLE; Schema: public; Owner: cms
--

CREATE TABLE public.page_box (
    id integer DEFAULT nextval('public.box_style_id_seq'::regclass) NOT NULL,
    title character varying NOT NULL,
    module character varying,
    fontsize smallint,
    fontfamily character varying,
    textcolor character varying,
    bgcolor character varying,
    bgimage character varying,
    borderwidth smallint,
    bordercolor character varying,
    borderradius smallint,
    bgrepeat smallint,
    bgstretch smallint
);


ALTER TABLE public.page_box OWNER TO cms;

--
-- TOC entry 202 (class 1259 OID 16463)
-- Name: page_config_id_seq; Type: SEQUENCE; Schema: public; Owner: cms
--

CREATE SEQUENCE public.page_config_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.page_config_id_seq OWNER TO cms;

--
-- TOC entry 214 (class 1259 OID 16531)
-- Name: page_config; Type: TABLE; Schema: public; Owner: cms
--

CREATE TABLE public.page_config (
    id integer DEFAULT nextval('public.page_config_id_seq'::regclass) NOT NULL,
    bgcolor character varying,
    bgimage character varying,
    fontsize smallint,
    fontfamily character varying,
    textcolor character varying,
    boxsizing smallint,
    bgrepeat smallint,
    bgstretch smallint
);


ALTER TABLE public.page_config OWNER TO cms;

--
-- TOC entry 203 (class 1259 OID 16465)
-- Name: pages_id_seq; Type: SEQUENCE; Schema: public; Owner: cms
--

CREATE SEQUENCE public.pages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.pages_id_seq OWNER TO cms;

--
-- TOC entry 215 (class 1259 OID 16540)
-- Name: pages; Type: TABLE; Schema: public; Owner: cms
--

CREATE TABLE public.pages (
    id integer DEFAULT nextval('public.pages_id_seq'::regclass) NOT NULL,
    title character varying NOT NULL,
    is_default smallint NOT NULL,
    publish smallint NOT NULL,
    cat_id integer
);


ALTER TABLE public.pages OWNER TO cms;

--
-- TOC entry 204 (class 1259 OID 16467)
-- Name: pages_to_boxes_id_seq; Type: SEQUENCE; Schema: public; Owner: cms
--

CREATE SEQUENCE public.pages_to_boxes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.pages_to_boxes_id_seq OWNER TO cms;

--
-- TOC entry 216 (class 1259 OID 16549)
-- Name: pages_to_boxes; Type: TABLE; Schema: public; Owner: cms
--

CREATE TABLE public.pages_to_boxes (
    id integer DEFAULT nextval('public.pages_to_boxes_id_seq'::regclass) NOT NULL,
    page_id integer NOT NULL,
    box_id integer NOT NULL
);


ALTER TABLE public.pages_to_boxes OWNER TO cms;

--
-- TOC entry 205 (class 1259 OID 16469)
-- Name: pages_to_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: cms
--

CREATE SEQUENCE public.pages_to_categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.pages_to_categories_id_seq OWNER TO cms;

--
-- TOC entry 217 (class 1259 OID 16555)
-- Name: pages_to_categories; Type: TABLE; Schema: public; Owner: cms
--

CREATE TABLE public.pages_to_categories (
    id integer DEFAULT nextval('public.pages_to_categories_id_seq'::regclass) NOT NULL,
    page_id integer NOT NULL,
    category_id integer NOT NULL
);


ALTER TABLE public.pages_to_categories OWNER TO cms;

--
-- TOC entry 206 (class 1259 OID 16471)
-- Name: pages_to_config_id_seq; Type: SEQUENCE; Schema: public; Owner: cms
--

CREATE SEQUENCE public.pages_to_config_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.pages_to_config_id_seq OWNER TO cms;

--
-- TOC entry 218 (class 1259 OID 16561)
-- Name: pages_to_config; Type: TABLE; Schema: public; Owner: cms
--

CREATE TABLE public.pages_to_config (
    id integer DEFAULT nextval('public.pages_to_config_id_seq'::regclass) NOT NULL,
    page_id integer NOT NULL,
    config_id integer NOT NULL
);


ALTER TABLE public.pages_to_config OWNER TO cms;

--
-- TOC entry 207 (class 1259 OID 16473)
-- Name: public_themes_id_seq; Type: SEQUENCE; Schema: public; Owner: cms
--

CREATE SEQUENCE public.public_themes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.public_themes_id_seq OWNER TO cms;

--
-- TOC entry 219 (class 1259 OID 16567)
-- Name: public_themes; Type: TABLE; Schema: public; Owner: cms
--

CREATE TABLE public.public_themes (
    id integer DEFAULT nextval('public.public_themes_id_seq'::regclass) NOT NULL,
    title character varying NOT NULL,
    bgcolor character varying,
    bgimage character varying,
    fontsize smallint,
    fontfamily character varying,
    textcolor character varying,
    isdefault smallint NOT NULL,
    thumbnail character varying,
    boxspacing smallint,
    bgrepeat smallint,
    bgstretch smallint,
    mui character varying
);


ALTER TABLE public.public_themes OWNER TO cms;

--
-- TOC entry 2866 (class 2606 OID 16483)
-- Name: admin_themes admin_themes_pkey; Type: CONSTRAINT; Schema: public; Owner: cms
--

ALTER TABLE ONLY public.admin_themes
    ADD CONSTRAINT admin_themes_pkey PRIMARY KEY (id);


--
-- TOC entry 2877 (class 2606 OID 16530)
-- Name: page_box box_style_pkey; Type: CONSTRAINT; Schema: public; Owner: cms
--

ALTER TABLE ONLY public.page_box
    ADD CONSTRAINT box_style_pkey PRIMARY KEY (id);


--
-- TOC entry 2871 (class 2606 OID 16503)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: cms
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 2873 (class 2606 OID 16512)
-- Name: gallery_images gallery_images_pkey; Type: CONSTRAINT; Schema: public; Owner: cms
--

ALTER TABLE ONLY public.gallery_images
    ADD CONSTRAINT gallery_images_pkey PRIMARY KEY (id);


--
-- TOC entry 2875 (class 2606 OID 16521)
-- Name: gallery_module gallery_module_pkey; Type: CONSTRAINT; Schema: public; Owner: cms
--

ALTER TABLE ONLY public.gallery_module
    ADD CONSTRAINT gallery_module_pkey PRIMARY KEY (id);


--
-- TOC entry 2869 (class 2606 OID 16492)
-- Name: auth_admin id_pk; Type: CONSTRAINT; Schema: public; Owner: cms
--

ALTER TABLE ONLY public.auth_admin
    ADD CONSTRAINT id_pk PRIMARY KEY (id);


--
-- TOC entry 2879 (class 2606 OID 16539)
-- Name: page_config page_config_pkey; Type: CONSTRAINT; Schema: public; Owner: cms
--

ALTER TABLE ONLY public.page_config
    ADD CONSTRAINT page_config_pkey PRIMARY KEY (id);


--
-- TOC entry 2881 (class 2606 OID 16548)
-- Name: pages pages_pkey; Type: CONSTRAINT; Schema: public; Owner: cms
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_pkey PRIMARY KEY (id);


--
-- TOC entry 2883 (class 2606 OID 16554)
-- Name: pages_to_boxes pages_to_boxes_pkey; Type: CONSTRAINT; Schema: public; Owner: cms
--

ALTER TABLE ONLY public.pages_to_boxes
    ADD CONSTRAINT pages_to_boxes_pkey PRIMARY KEY (id);


--
-- TOC entry 2885 (class 2606 OID 16560)
-- Name: pages_to_categories pages_to_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: cms
--

ALTER TABLE ONLY public.pages_to_categories
    ADD CONSTRAINT pages_to_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 2887 (class 2606 OID 16566)
-- Name: pages_to_config pages_to_config_pkey; Type: CONSTRAINT; Schema: public; Owner: cms
--

ALTER TABLE ONLY public.pages_to_config
    ADD CONSTRAINT pages_to_config_pkey PRIMARY KEY (id);


--
-- TOC entry 2889 (class 2606 OID 16575)
-- Name: public_themes public_themes_pkey; Type: CONSTRAINT; Schema: public; Owner: cms
--

ALTER TABLE ONLY public.public_themes
    ADD CONSTRAINT public_themes_pkey PRIMARY KEY (id);


--
-- TOC entry 2867 (class 1259 OID 16493)
-- Name: email_idx; Type: INDEX; Schema: public; Owner: cms
--

CREATE UNIQUE INDEX email_idx ON public.auth_admin USING btree (email COLLATE "C" varchar_ops) INCLUDE (email);


-- Completed on 2021-02-17 21:53:17 UTC

--
-- PostgreSQL database dump complete
--

INSERT INTO public.auth_admin(
	email, fullname, fname, lname, password, active)
	VALUES ('ovidiu.alexa@gmail.com', 'Ovidiu Alexa', 'Ovidiu', 'Alexa', MD5('1qaz'), 1);