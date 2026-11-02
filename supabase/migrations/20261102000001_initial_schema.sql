-- ==============================================================================
-- Mahakali Production - Core Cinematic Studio Architecture & RBAC Schema
-- PostgreSQL / Supabase Migration
-- File: supabase/migrations/20261102000001_initial_schema.sql
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'client');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE package_tier AS ENUM (
        'Mahakali Plus Full HD',
        'Mahakali Pro 4K',
        'Mahakali Max Asli 4K',
        'Mahakali Ultra Asli 4K'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE event_type AS ENUM (
        'Wedding',
        'Pre-Wedding',
        'Ring Ceremony'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM (
        'Pending',
        'In-Production',
        'Completed',
        'Delivered'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM (
        'Paid',
        'Pending',
        'Overdue'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE invoice_status AS ENUM (
        'Unpaid',
        'Partially_Paid',
        'Paid'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 3. TABLES

-- 3.1 Users Profile Table (Integrated with Supabase Auth or Standalone App Session)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password_hash TEXT,
    role user_role NOT NULL DEFAULT 'client',
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for high speed role and verification checks
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_verified ON public.users(is_verified);

-- 3.2 Orders & Bookings Table
CREATE TABLE IF NOT EXISTS public.orders_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    package_name package_tier NOT NULL,
    event_date DATE NOT NULL,
    event_type event_type NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    balance_due NUMERIC(12, 2) NOT NULL CHECK (balance_due >= 0),
    status booking_status NOT NULL DEFAULT 'Pending',
    delivery_estimate_days INTEGER NOT NULL DEFAULT 30 CHECK (delivery_estimate_days >= 0),
    venue_location TEXT,
    special_instructions TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_orders_client_id ON public.orders_bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders_bookings(status);
CREATE INDEX IF NOT EXISTS idx_orders_event_date ON public.orders_bookings(event_date);

-- 3.3 Payments & EMI Schedule Table
CREATE TABLE IF NOT EXISTS public.payments_emi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders_bookings(id) ON DELETE CASCADE,
    installment_no INTEGER NOT NULL CHECK (installment_no > 0),
    due_date DATE NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    status payment_status NOT NULL DEFAULT 'Pending',
    transaction_ref TEXT,
    paid_at TIMESTAMPTZ,
    payment_method TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_order_installment UNIQUE (order_id, installment_no)
);

CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments_emi(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments_emi(status);
CREATE INDEX IF NOT EXISTS idx_payments_due_date ON public.payments_emi(due_date);

-- 3.4 Invoices Table
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders_bookings(id) ON DELETE CASCADE,
    invoice_number TEXT UNIQUE NOT NULL,
    generated_date TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    pdf_url TEXT,
    payment_status invoice_status NOT NULL DEFAULT 'Unpaid',
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0,
    tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_invoices_order_id ON public.invoices(order_id);
CREATE INDEX IF NOT EXISTS idx_invoices_number ON public.invoices(invoice_number);

-- 3.5 OTP & Verification Tokens Table
CREATE TABLE IF NOT EXISTS public.verification_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    otp_code_hash TEXT NOT NULL,
    token_type TEXT NOT NULL DEFAULT 'email_verification',
    expires_at TIMESTAMPTZ NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    max_attempts INTEGER NOT NULL DEFAULT 5,
    is_used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_verification_user ON public.verification_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_email ON public.verification_tokens(email);
CREATE INDEX IF NOT EXISTS idx_verification_expires ON public.verification_tokens(expires_at);

-- 4. HELPER FUNCTIONS & TRIGGERS

-- 4.1 Update timestamp trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_users_updated_at ON public.users;
CREATE TRIGGER tr_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_orders_updated_at ON public.orders_bookings;
CREATE TRIGGER tr_orders_updated_at
    BEFORE UPDATE ON public.orders_bookings
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_payments_updated_at ON public.payments_emi;
CREATE TRIGGER tr_payments_updated_at
    BEFORE UPDATE ON public.payments_emi
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_invoices_updated_at ON public.invoices;
CREATE TRIGGER tr_invoices_updated_at
    BEFORE UPDATE ON public.invoices
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 4.2 Automated Balance & Invoice Status Recalculation
CREATE OR REPLACE FUNCTION public.recalculate_order_balance()
RETURNS TRIGGER AS $$
DECLARE
    target_order_id UUID;
    v_total NUMERIC(12, 2);
    v_paid NUMERIC(12, 2);
    v_new_balance NUMERIC(12, 2);
    v_invoice_status invoice_status;
BEGIN
    target_order_id := COALESCE(NEW.order_id, OLD.order_id);

    SELECT total_amount INTO v_total
    FROM public.orders_bookings
    WHERE id = target_order_id;

    SELECT COALESCE(SUM(amount), 0) INTO v_paid
    FROM public.payments_emi
    WHERE order_id = target_order_id AND status = 'Paid';

    v_new_balance := GREATEST(0, v_total - v_paid);

    UPDATE public.orders_bookings
    SET balance_due = v_new_balance
    WHERE id = target_order_id;

    -- Compute invoice status
    IF v_paid = 0 THEN
        v_invoice_status := 'Unpaid';
    ELSIF v_paid < v_total THEN
        v_invoice_status := 'Partially_Paid';
    ELSE
        v_invoice_status := 'Paid';
    END IF;

    UPDATE public.invoices
    SET payment_status = v_invoice_status
    WHERE order_id = target_order_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_sync_order_balance ON public.payments_emi;
CREATE TRIGGER tr_sync_order_balance
    AFTER INSERT OR UPDATE OR DELETE ON public.payments_emi
    FOR EACH ROW EXECUTE FUNCTION public.recalculate_order_balance();

-- 4.3 Supabase Auth Sync Trigger (Automatically syncs auth.users to public.users if Supabase Auth is used)
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
DECLARE
    assigned_role user_role := 'client';
    is_admin_email BOOLEAN := FALSE;
BEGIN
    -- Check if metadata or email designates admin
    IF (NEW.raw_user_meta_data->>'role') = 'admin' OR NEW.email LIKE '%@mahakaliproduction.com' THEN
        assigned_role := 'admin';
    END IF;

    INSERT INTO public.users (id, full_name, email, phone, role, is_verified)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.email,
        NEW.raw_user_meta_data->>'phone',
        assigned_role,
        COALESCE(NEW.email_confirmed_at IS NOT NULL, FALSE)
    )
    ON CONFLICT (email) DO UPDATE
    SET
        id = EXCLUDED.id,
        full_name = COALESCE(EXCLUDED.full_name, public.users.full_name),
        phone = COALESCE(EXCLUDED.phone, public.users.phone),
        is_verified = COALESCE(public.users.is_verified, EXCLUDED.is_verified);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users (wrapped conditionally if executed in Supabase instance)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users') THEN
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        CREATE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();
    END IF;
END $$;

-- 5. ROW-LEVEL SECURITY (RLS) POLICIES

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments_emi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_tokens ENABLE ROW LEVEL SECURITY;

-- Helper to check if current user is admin in Supabase
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 5.1 Users RLS
DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
CREATE POLICY "Users can read own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id OR public.is_admin())
    WITH CHECK (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Admins have full user management" ON public.users;
CREATE POLICY "Admins have full user management"
    ON public.users FOR ALL
    USING (public.is_admin());

-- 5.2 Orders Bookings RLS
DROP POLICY IF EXISTS "Clients view their own bookings" ON public.orders_bookings;
CREATE POLICY "Clients view their own bookings"
    ON public.orders_bookings FOR SELECT
    USING (client_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Admins manage all bookings" ON public.orders_bookings;
CREATE POLICY "Admins manage all bookings"
    ON public.orders_bookings FOR ALL
    USING (public.is_admin());

-- 5.3 Payments EMI RLS
DROP POLICY IF EXISTS "Clients view EMI for their orders" ON public.payments_emi;
CREATE POLICY "Clients view EMI for their orders"
    ON public.payments_emi FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.orders_bookings ob
            WHERE ob.id = public.payments_emi.order_id
            AND ob.client_id = auth.uid()
        )
        OR public.is_admin()
    );

DROP POLICY IF EXISTS "Admins manage all payments" ON public.payments_emi;
CREATE POLICY "Admins manage all payments"
    ON public.payments_emi FOR ALL
    USING (public.is_admin());

-- 5.4 Invoices RLS
DROP POLICY IF EXISTS "Clients view invoices for their orders" ON public.invoices;
CREATE POLICY "Clients view invoices for their orders"
    ON public.invoices FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.orders_bookings ob
            WHERE ob.id = public.invoices.order_id
            AND ob.client_id = auth.uid()
        )
        OR public.is_admin()
    );

DROP POLICY IF EXISTS "Admins manage all invoices" ON public.invoices;
CREATE POLICY "Admins manage all invoices"
    ON public.invoices FOR ALL
    USING (public.is_admin());

-- 5.5 Verification Tokens RLS (Internal service role only or matching user)
DROP POLICY IF EXISTS "Users can access own verification tokens" ON public.verification_tokens;
CREATE POLICY "Users can access own verification tokens"
    ON public.verification_tokens FOR SELECT
    USING (user_id = auth.uid() OR public.is_admin());
