-- ==============================================================================
-- Mahakali Production - Seed Demo & Initial Production Data
-- File: supabase/seed.sql
-- ==============================================================================

-- 1. Insert Initial Users
-- Password for demo accounts: "Mahakali@2026" (bcrypt hashed: $2a$10$wK1mYcKqGqD9bO.V0mNVO.K2vWshhN.a3s7Ue1wzfvYfBhyhRk.Oa)
INSERT INTO public.users (id, full_name, email, phone, role, is_verified, password_hash)
VALUES
    (
        'c0000000-0000-0000-0000-000000000001',
        'Mahakali Studio Director (Owner)',
        'admin@mahakaliproduction.com',
        '+91 98765 43210',
        'admin',
        TRUE,
        '$2a$10$wK1mYcKqGqD9bO.V0mNVO.K2vWshhN.a3s7Ue1wzfvYfBhyhRk.Oa'
    ),
    (
        'c0000000-0000-0000-0000-000000000002',
        'Priya & Rahul Sharma',
        'priya.rahul@gmail.com',
        '+91 99887 76655',
        'client',
        TRUE,
        '$2a$10$wK1mYcKqGqD9bO.V0mNVO.K2vWshhN.a3s7Ue1wzfvYfBhyhRk.Oa'
    ),
    (
        'c0000000-0000-0000-0000-000000000003',
        'Ananya & Vikram Malhotra',
        'ananya.v@outlook.com',
        '+91 97711 22334',
        'client',
        TRUE,
        '$2a$10$wK1mYcKqGqD9bO.V0mNVO.K2vWshhN.a3s7Ue1wzfvYfBhyhRk.Oa'
    )
ON CONFLICT (email) DO NOTHING;

-- 2. Insert Orders & Bookings
INSERT INTO public.orders_bookings (
    id,
    client_id,
    package_name,
    event_date,
    event_type,
    total_amount,
    balance_due,
    status,
    delivery_estimate_days,
    venue_location,
    special_instructions
)
VALUES
    (
        'b0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000002',
        'Mahakali Ultra Asli 4K',
        '2026-12-14',
        'Wedding',
        350000.00,
        150000.00,
        'In-Production',
        25,
        'The Leela Palace, Udaipur',
        'Special multi-cam drone coverage for Varmala and candid bridal cinema reel.'
    ),
    (
        'b0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000002',
        'Mahakali Pro 4K',
        '2026-11-20',
        'Pre-Wedding',
        125000.00,
        0.00,
        'Completed',
        15,
        'Rishikesh Riverfront & Pine Forest',
        'Cinematic 60fps slow-motion sunset sequence.'
    ),
    (
        'b0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000003',
        'Mahakali Max Asli 4K',
        '2027-01-18',
        'Ring Ceremony',
        185000.00,
        185000.00,
        'Pending',
        20,
        'Taj Falaknuma Palace, Hyderabad',
        'Traditional floral entryway and live audio mastering.'
    )
ON CONFLICT (id) DO NOTHING;

-- 3. Insert EMI Schedules & Payments
INSERT INTO public.payments_emi (
    id,
    order_id,
    installment_no,
    due_date,
    amount,
    status,
    transaction_ref,
    paid_at,
    payment_method
)
VALUES
    -- Order 1 EMIs
    (
        'e0000000-0000-0000-0000-000000000001',
        'b0000000-0000-0000-0000-000000000001',
        1,
        '2026-09-01',
        100000.00,
        'Paid',
        'HDFC_UPI_982347101',
        '2026-09-01 14:30:00+00',
        'UPI / Net Banking'
    ),
    (
        'e0000000-0000-0000-0000-000000000002',
        'b0000000-0000-0000-0000-000000000001',
        2,
        '2026-10-15',
        100000.00,
        'Paid',
        'HDFC_NEFT_882910384',
        '2026-10-15 11:20:00+00',
        'NEFT'
    ),
    (
        'e0000000-0000-0000-0000-000000000003',
        'b0000000-0000-0000-0000-000000000001',
        3,
        '2026-11-30',
        150000.00,
        'Pending',
        NULL,
        NULL,
        NULL
    ),
    -- Order 2 EMIs
    (
        'e0000000-0000-0000-0000-000000000004',
        'b0000000-0000-0000-0000-000000000002',
        1,
        '2026-10-01',
        125000.00,
        'Paid',
        'ICICI_IMPS_771928374',
        '2026-10-01 16:45:00+00',
        'IMPS'
    ),
    -- Order 3 EMIs
    (
        'e0000000-0000-0000-0000-000000000005',
        'b0000000-0000-0000-0000-000000000003',
        1,
        '2026-10-25',
        92500.00,
        'Overdue',
        NULL,
        NULL,
        NULL
    ),
    (
        'e0000000-0000-0000-0000-000000000006',
        'b0000000-0000-0000-0000-000000000003',
        2,
        '2026-12-15',
        92500.00,
        'Pending',
        NULL,
        NULL,
        NULL
    )
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Invoices
INSERT INTO public.invoices (
    id,
    order_id,
    invoice_number,
    generated_date,
    pdf_url,
    payment_status,
    subtotal,
    tax_amount,
    total_amount
)
VALUES
    (
        'f0000000-0000-0000-0000-000000000001',
        'b0000000-0000-0000-0000-000000000001',
        'INV-MP-2026-0089',
        '2026-09-01 10:00:00+00',
        '/invoices/INV-MP-2026-0089.pdf',
        'Partially_Paid',
        296610.17,
        53389.83,
        350000.00
    ),
    (
        'f0000000-0000-0000-0000-000000000002',
        'b0000000-0000-0000-0000-000000000002',
        'INV-MP-2026-0094',
        '2026-10-01 10:00:00+00',
        '/invoices/INV-MP-2026-0094.pdf',
        'Paid',
        105932.20,
        19067.80,
        125000.00
    ),
    (
        'f0000000-0000-0000-0000-000000000003',
        'b0000000-0000-0000-0000-000000000003',
        'INV-MP-2026-0102',
        '2026-10-20 10:00:00+00',
        '/invoices/INV-MP-2026-0102.pdf',
        'Unpaid',
        156779.66,
        28220.34,
        185000.00
    )
ON CONFLICT (id) DO NOTHING;
