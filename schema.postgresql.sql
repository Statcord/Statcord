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

ALTER SCHEMA public OWNER TO disstat;

COMMENT ON SCHEMA public IS 'standard public schema';

SET default_tablespace = '';
SET default_table_access_method = heap;


CREATE TABLE public.owners (
    ownerid character varying NOT NULL,
    username character varying NOT NULL,
    aboutme character varying,
    avatar character varying NOT NULL,
    website character varying,
    public boolean NOT NULL DEFAULT 'true',
    plevel numeric NOT NULL DEFAULT 0
);
ALTER TABLE public.owners OWNER TO disstat;
ALTER TABLE ONLY public.owners
    ADD CONSTRAINT owners_pkey PRIMARY KEY (ownerid);


CREATE TABLE public.bots (
    botid character varying NOT NULL,
    username character varying NOT NULL,
    avatar character varying NOT NULL,
    token character varying NOT NULL,
    public boolean DEFAULT true,
    ownerid character varying NOT NULL,
    maxcustomcharts integer DEFAULT 2,
    addedon timestamp without time zone,
    nsfw boolean NOT NULL DEFAULT false,
    shortdesc character varying NOT NULL,
    longdesc character varying NOT NULL,
    invite character varying NOT NULL
);
ALTER TABLE public.bots OWNER TO disstat;
ALTER TABLE ONLY public.bots
    ADD CONSTRAINT bots_pkey PRIMARY KEY (botid);


CREATE TABLE public.chartsettings (
    botid character varying,
    type character varying,
    chartid character varying,
    enabled boolean DEFAULT true,
    name character varying,
    label character varying,
    custom boolean NOT NULL DEFAULT 'false',
    category character varying NOT NULL
    PRIMARY KEY (chartid, botid)
);
ALTER TABLE IF EXISTS public.chartsettings
    OWNER to disstat;

CREATE TABLE public.botlinks (
    botid character varying,
    name character varying,
    url character varying,
    icon character varying
);
ALTER TABLE IF EXISTS public.botlinks
    OWNER to disstat;