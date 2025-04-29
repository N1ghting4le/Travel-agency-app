--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.2

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookings (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    tour_id uuid NOT NULL,
    room_type text NOT NULL,
    nutrition_type text NOT NULL,
    adults_amount integer NOT NULL,
    children_amount integer NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    booking_date date NOT NULL,
    total_price double precision NOT NULL,
    taken_by uuid,
    status text NOT NULL
);


ALTER TABLE public.bookings OWNER TO postgres;

--
-- Name: hotels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hotels (
    id uuid NOT NULL,
    hotel_title text NOT NULL,
    address text NOT NULL,
    hotel_descr text NOT NULL,
    nutrition_types text[] NOT NULL,
    room_types text[] NOT NULL,
    stars integer NOT NULL,
    photos text[] NOT NULL,
    hotel_notes text,
    resort_id uuid NOT NULL
);


ALTER TABLE public.hotels OWNER TO postgres;

--
-- Name: resorts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resorts (
    id uuid NOT NULL,
    resort_title text NOT NULL,
    resort_country text NOT NULL
);


ALTER TABLE public.resorts OWNER TO postgres;

--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    tour_id uuid NOT NULL,
    review_date date NOT NULL,
    mark integer NOT NULL,
    review_text text NOT NULL
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- Name: tours; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tours (
    id uuid NOT NULL,
    hotel_id uuid NOT NULL,
    departure_city text NOT NULL,
    destination_country text NOT NULL,
    base_price double precision NOT NULL,
    tour_title text NOT NULL,
    tour_descr text,
    tour_notes text,
    delete boolean
);


ALTER TABLE public.tours OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    name text NOT NULL,
    surname text NOT NULL,
    phone_number text NOT NULL,
    role text NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: bookings Booking_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT "Booking_pkey" PRIMARY KEY (id);


--
-- Name: hotels Hotel_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hotels
    ADD CONSTRAINT "Hotel_pkey" PRIMARY KEY (id);


--
-- Name: reviews Review_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "Review_pkey" PRIMARY KEY (id);


--
-- Name: tours Tour_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tours
    ADD CONSTRAINT "Tour_pkey" PRIMARY KEY (id);


--
-- Name: users User_email_phone_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "User_email_phone_number_key" UNIQUE (email, phone_number);


--
-- Name: users User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: resorts resorts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resorts
    ADD CONSTRAINT resorts_pkey PRIMARY KEY (id);


--
-- Name: bookings FK1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT "FK1" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: reviews FK1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "FK1" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: tours FK1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tours
    ADD CONSTRAINT "FK1" FOREIGN KEY (hotel_id) REFERENCES public.hotels(id) NOT VALID;


--
-- Name: bookings FK2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT "FK2" FOREIGN KEY (tour_id) REFERENCES public.tours(id);


--
-- Name: reviews FK2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "FK2" FOREIGN KEY (tour_id) REFERENCES public.tours(id) ON DELETE CASCADE NOT VALID;


--
-- Name: bookings FK3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT "FK3" FOREIGN KEY (taken_by) REFERENCES public.users(id) NOT VALID;


--
-- Name: hotels Resort_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hotels
    ADD CONSTRAINT "Resort_fkey" FOREIGN KEY (resort_id) REFERENCES public.resorts(id) NOT VALID;


--
-- PostgreSQL database dump complete
--

