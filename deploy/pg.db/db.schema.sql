--
-- PostgreSQL database dump
--

-- Dumped from database version 11.12
-- Dumped by pg_dump version 11.12

-- Started on 2021-08-05 10:56:28 UTC


--
-- TOC entry 196 (class 1259 OID 16451)
-- Name: admin_themes_id_seq; Type: SEQUENCE; Schema: public; Owner: cms
--

CREATE SEQUENCE public.admin_themes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.admin_themes_id_seq OWNER TO cms;

SET default_tablespace = '';

--
-- TOC entry 197 (class 1259 OID 16453)
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
-- TOC entry 198 (class 1259 OID 16460)
-- Name: auth_admin_id_seq; Type: SEQUENCE; Schema: public; Owner: cms
--

CREATE SEQUENCE public.auth_admin_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.auth_admin_id_seq OWNER TO cms;

--
-- TOC entry 199 (class 1259 OID 16462)
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
-- TOC entry 200 (class 1259 OID 16469)
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
-- TOC entry 201 (class 1259 OID 16471)
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
-- TOC entry 202 (class 1259 OID 16473)
-- Name: categories; Type: TABLE; Schema: public; Owner: cms
--

CREATE TABLE public.categories (
    id integer DEFAULT nextval('public.categories_id_seq'::regclass) NOT NULL,
    title character varying NOT NULL,
    description character varying,
    backgroundimage character varying,
    parentid integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.categories OWNER TO cms;

--
-- TOC entry 203 (class 1259 OID 16481)
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
-- TOC entry 204 (class 1259 OID 16483)
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
-- TOC entry 3032 (class 0 OID 0)
-- Dependencies: 204
-- Name: COLUMN gallery_images.link; Type: COMMENT; Schema: public; Owner: cms
--

COMMENT ON COLUMN public.gallery_images.link IS '- the link to which the user should be redirected upon clicking on an image';


--
-- TOC entry 3033 (class 0 OID 0)
-- Dependencies: 204
-- Name: COLUMN gallery_images.path; Type: COMMENT; Schema: public; Owner: cms
--

COMMENT ON COLUMN public.gallery_images.path IS '- path to image source';


--
-- TOC entry 205 (class 1259 OID 16490)
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
-- TOC entry 206 (class 1259 OID 16492)
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
-- TOC entry 207 (class 1259 OID 16499)
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
    bgstretch smallint,
    bggradient smallint,
    height smallint,
    width smallint,
    moduleoptions character varying,
    x smallint,
    y smallint,
    borderstyle character varying,
    showscrollbars smallint
);


ALTER TABLE public.page_box OWNER TO cms;

--
-- TOC entry 208 (class 1259 OID 16506)
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
-- TOC entry 209 (class 1259 OID 16508)
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
    bgstretch smallint,
    bggradient smallint,
    templateused character varying
);


ALTER TABLE public.page_config OWNER TO cms;

--
-- TOC entry 210 (class 1259 OID 16517)
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
-- TOC entry 211 (class 1259 OID 16519)
-- Name: pages; Type: TABLE; Schema: public; Owner: cms
--

CREATE TABLE public.pages (
    id integer DEFAULT nextval('public.pages_id_seq'::regclass) NOT NULL,
    title character varying NOT NULL,
    is_default smallint NOT NULL,
    publish smallint NOT NULL,
    cat_id integer,
    pagelink character varying,
    istemplate smallint
);


ALTER TABLE public.pages OWNER TO cms;

--
-- TOC entry 212 (class 1259 OID 16528)
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
-- TOC entry 213 (class 1259 OID 16530)
-- Name: pages_to_boxes; Type: TABLE; Schema: public; Owner: cms
--

CREATE TABLE public.pages_to_boxes (
    id integer DEFAULT nextval('public.pages_to_boxes_id_seq'::regclass) NOT NULL,
    page_id integer NOT NULL,
    box_id integer NOT NULL
);


ALTER TABLE public.pages_to_boxes OWNER TO cms;

--
-- TOC entry 214 (class 1259 OID 16534)
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
-- TOC entry 215 (class 1259 OID 16536)
-- Name: pages_to_categories; Type: TABLE; Schema: public; Owner: cms
--

CREATE TABLE public.pages_to_categories (
    id integer DEFAULT nextval('public.pages_to_categories_id_seq'::regclass) NOT NULL,
    page_id integer NOT NULL,
    category_id integer NOT NULL
);


ALTER TABLE public.pages_to_categories OWNER TO cms;

--
-- TOC entry 216 (class 1259 OID 16540)
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
-- TOC entry 217 (class 1259 OID 16542)
-- Name: pages_to_config; Type: TABLE; Schema: public; Owner: cms
--

CREATE TABLE public.pages_to_config (
    id integer DEFAULT nextval('public.pages_to_config_id_seq'::regclass) NOT NULL,
    page_id integer NOT NULL,
    config_id integer NOT NULL
);


ALTER TABLE public.pages_to_config OWNER TO cms;

--
-- TOC entry 218 (class 1259 OID 16546)
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
-- TOC entry 219 (class 1259 OID 16548)
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
    bggradient smallint,
    mui character varying
);


ALTER TABLE public.public_themes OWNER TO cms;

--
-- TOC entry 221 (class 1259 OID 24772)
-- Name: users; Type: TABLE; Schema: public; Owner: cms
--

CREATE TABLE public.users (
    id integer NOT NULL,
    fname character varying NOT NULL,
    lname character varying NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    type smallint NOT NULL,
    active smallint NOT NULL,
    added bigint NOT NULL,
    accessed bigint NOT NULL
);


ALTER TABLE public.users OWNER TO cms;

--
-- TOC entry 220 (class 1259 OID 24770)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: cms
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO cms;

--
-- TOC entry 3034 (class 0 OID 0)
-- Dependencies: 220
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cms
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 2872 (class 2604 OID 24775)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: cms
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 2874 (class 2606 OID 16556)
-- Name: admin_themes admin_themes_pkey; Type: CONSTRAINT; Schema: public; Owner: cms
--

ALTER TABLE ONLY public.admin_themes
    ADD CONSTRAINT admin_themes_pkey PRIMARY KEY (id);


--
-- TOC entry 2885 (class 2606 OID 16558)
-- Name: page_box box_style_pkey; Type: CONSTRAINT; Schema: public; Owner: cms
--

ALTER TABLE ONLY public.page_box
    ADD CONSTRAINT box_style_pkey PRIMARY KEY (id);


--
-- TOC entry 2879 (class 2606 OID 16560)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: cms
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 2881 (class 2606 OID 16562)
-- Name: gallery_images gallery_images_pkey; Type: CONSTRAINT; Schema: public; Owner: cms
--

ALTER TABLE ONLY public.gallery_images
    ADD CONSTRAINT gallery_images_pkey PRIMARY KEY (id);


--
-- TOC entry 2883 (class 2606 OID 16564)
-- Name: gallery_module gallery_module_pkey; Type: CONSTRAINT; Schema: public; Owner: cms
--

ALTER TABLE ONLY public.gallery_module
    ADD CONSTRAINT gallery_module_pkey PRIMARY KEY (id);


--
-- TOC entry 2877 (class 2606 OID 16566)
-- Name: auth_admin id_pk; Type: CONSTRAINT; Schema: public; Owner: cms
--

ALTER TABLE ONLY public.auth_admin
    ADD CONSTRAINT id_pk PRIMARY KEY (id);


--
-- TOC entry 2887 (class 2606 OID 16516)
-- Name: page_config page_config_pkey; Type: CONSTRAINT; Schema: public; Owner: cms
--

ALTER TABLE ONLY public.page_config
    ADD CONSTRAINT page_config_pkey PRIMARY KEY (id);


--
-- TOC entry 2889 (class 2606 OID 16527)
-- Name: pages pages_pkey; Type: CONSTRAINT; Schema: public; Owner: cms
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_pkey PRIMARY KEY (id);


--
-- TOC entry 2891 (class 2606 OID 16568)
-- Name: pages_to_boxes pages_to_boxes_pkey; Type: CONSTRAINT; Schema: public; Owner: cms
--

ALTER TABLE ONLY public.pages_to_boxes
    ADD CONSTRAINT pages_to_boxes_pkey PRIMARY KEY (id);


--
-- TOC entry 2893 (class 2606 OID 16570)
-- Name: pages_to_categories pages_to_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: cms
--

ALTER TABLE ONLY public.pages_to_categories
    ADD CONSTRAINT pages_to_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 2895 (class 2606 OID 16572)
-- Name: pages_to_config pages_to_config_pkey; Type: CONSTRAINT; Schema: public; Owner: cms
--

ALTER TABLE ONLY public.pages_to_config
    ADD CONSTRAINT pages_to_config_pkey PRIMARY KEY (id);


--
-- TOC entry 2897 (class 2606 OID 16574)
-- Name: public_themes public_themes_pkey; Type: CONSTRAINT; Schema: public; Owner: cms
--

ALTER TABLE ONLY public.public_themes
    ADD CONSTRAINT public_themes_pkey PRIMARY KEY (id);


--
-- TOC entry 2904 (class 2606 OID 24780)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: cms
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 2875 (class 1259 OID 16575)
-- Name: email_idx; Type: INDEX; Schema: public; Owner: cms
--

CREATE UNIQUE INDEX email_idx ON public.auth_admin USING btree (email COLLATE "C" varchar_ops) INCLUDE (email);


--
-- TOC entry 2898 (class 1259 OID 24786)
-- Name: u_accessed; Type: INDEX; Schema: public; Owner: cms
--

CREATE INDEX u_accessed ON public.users USING btree (accessed);


--
-- TOC entry 2899 (class 1259 OID 24782)
-- Name: u_active; Type: INDEX; Schema: public; Owner: cms
--

CREATE INDEX u_active ON public.users USING btree (active);


--
-- TOC entry 2900 (class 1259 OID 24785)
-- Name: u_added; Type: INDEX; Schema: public; Owner: cms
--

CREATE INDEX u_added ON public.users USING btree (added);


--
-- TOC entry 2901 (class 1259 OID 24783)
-- Name: u_email; Type: INDEX; Schema: public; Owner: cms
--

CREATE INDEX u_email ON public.users USING btree (email COLLATE "C.UTF-8");


--
-- TOC entry 2902 (class 1259 OID 24784)
-- Name: u_type; Type: INDEX; Schema: public; Owner: cms
--

CREATE INDEX u_type ON public.users USING btree (type);


--
-- TOC entry 3031 (class 0 OID 0)
-- Dependencies: 3
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: cms
--

REVOKE ALL ON SCHEMA public FROM postgres;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO cms;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2021-08-05 10:56:28 UTC

--
-- PostgreSQL database dump complete
--

