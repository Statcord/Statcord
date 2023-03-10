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
    username character varying NOT NULL
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
    ownerid character varying NOT NULL
);
ALTER TABLE public.bots OWNER TO disstat;
ALTER TABLE ONLY public.bots
    ADD CONSTRAINT bots_pkey PRIMARY KEY (botid);