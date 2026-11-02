// ==============================================================================
// Mahakali Production - Core Database Type Definitions
// ==============================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'admin' | 'staff' | 'client';

export type StaffRole =
  | 'Lead Cinematographer'
  | 'Senior Video Editor'
  | 'Candid Photographer'
  | 'Drone Pilot'
  | 'Colorist & Sound Designer'
  | 'Production Assistant';

export type StaffRequestStatus = 'pending' | 'approved' | 'rejected';

export interface StaffRequest {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  requestedRole: StaffRole | string;
  reason: string;
  status: StaffRequestStatus;
  createdAt: string;
  approvedAt?: string;
  reviewedBy?: string;
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface CustomerReview {
  id: string;
  clientName: string;
  eventType: string;
  rating: number; // 1 to 5
  reviewText: string;
  shootDate?: string;
  status: ReviewStatus;
  createdAt: string;
  verifiedBookingId?: string;
}

export type NotificationType = 'enquiry' | 'staff_request' | 'review' | 'payment';

export interface AdminNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  linkTab?: string;
  read: boolean;
  createdAt: string;
  metadata?: {
    orderId?: string;
    clientName?: string;
    phone?: string;
    email?: string;
    amount?: number;
    rating?: number;
    role?: string;
  };
}

export interface StudioSettings {
  brandName: string;
  founder: string;
  phone: string;
  phoneRaw: string;
  whatsapp: string;
  email: string;
  instagram: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  tagline: string;
  heroHeadline: string;
}

export type PackageName =
  | 'MAHAKALI PLUS FULL HD'
  | 'MAHAKALI PRO 4K'
  | 'MAHAKALI MAX ASLI 4K'
  | 'MAHAKALI ULTRA ASLI 4K'
  | 'MAHAKALI PRE-WEDDING MAX-4K'
  | 'MAHAKALI PRE-WEDDING ULTRA ASLI 4K'
  | 'Mahakali Plus Full HD'
  | 'Mahakali Pro 4K'
  | 'Mahakali Max Asli 4K'
  | 'Mahakali Ultra Asli 4K'
  | 'Mahakali Cinematic Pre-Wedding';

export type EventType =
  | 'Wedding'
  | 'Pre-Wedding'
  | 'Ring Ceremony';

export type BookingStatus =
  | 'Pending Advance'
  | 'In-Production / Editing'
  | 'Ready for Delivery'
  | 'Completed'
  | 'New Enquiry'
  | 'Confirmed'
  | 'Shoot In-Progress'
  | 'Post-Production'
  | 'Delivered'
  | 'Pending'
  | 'In-Production'
  | 'Overdue';

export type PaymentStatus =
  | 'Paid'
  | 'Pending'
  | 'Overdue';

export type InvoicePaymentStatus =
  | 'Unpaid'
  | 'Partially_Paid'
  | 'Paid';

export type User = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  password_hash?: string | null;
  role: UserRole;
  is_verified: boolean;
  avatar_url?: string | null;
  created_at: string;
  updated_at?: string;
};

export type DeliverablesChecklist = {
  photosSelected?: boolean;     // Client raw photos shortlisted
  colorGrading?: boolean;       // High-end cinematic color grade completed
  teaserReady?: boolean;        // 4K Teaser / Reel rendered
  albumPrinted?: boolean;       // Luxury physical album bound & printed
  penDriveDispatched?: boolean; // Master high-speed USB dispatched
  albums?: boolean;             // Alias for albumPrinted
  penDrives?: boolean;          // Alias for penDriveDispatched
  reelEdits?: boolean;          // Alias for teaserReady
  frames?: boolean;             // Custom frames fabricated
};

export type OrderBooking = {
  id: string;
  client_id: string;
  package_name: PackageName;
  event_date: string;
  event_type: EventType;
  total_amount: number;
  balance_due: number;
  status: BookingStatus;
  delivery_estimate_days: number;
  venue_location?: string | null;
  special_instructions?: string | null;
  deliverables?: DeliverablesChecklist;
  created_at: string;
  updated_at: string;
  
  // Joins
  client?: User;
  payments?: PaymentEMI[];
  invoices?: Invoice[];
};

export type PaymentEMI = {
  id: string;
  order_id: string;
  installment_no: number;
  milestone_name?: string | null;
  due_date: string;
  amount: number;
  status: PaymentStatus;
  transaction_ref: string | null;
  paid_at: string | null;
  payment_method?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  
  // Joins
  order?: OrderBooking;
};

export type Invoice = {
  id: string;
  order_id: string;
  invoice_number: string;
  generated_date: string;
  pdf_url: string | null;
  payment_status: InvoicePaymentStatus;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  created_at: string;
  updated_at: string;
  
  // Joins
  order?: OrderBooking;
};

export type PortfolioItem = {
  id: string;
  title: string;
  category: 'Wedding Films' | 'Pre-Wedding' | 'Drone Cinematography' | 'Cinematic Reels' | 'Candid Photography';
  media_url?: string;
  video_url?: string;
  location?: string;
  couples?: string;
  specs?: string;
  runtime?: string;
  created_at: string;
};

export type VerificationToken = {
  id: string;
  user_id: string;
  email: string;
  otp_code_hash: string;
  token_type: string;
  expires_at: string;
  attempts: number;
  max_attempts: number;
  is_used: boolean;
  created_at: string;
};

// Supabase Database Type Schema Interface conforming directly to PostgREST
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          password_hash: string | null;
          role: UserRole;
          is_verified: boolean;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          phone?: string | null;
          password_hash?: string | null;
          role?: UserRole;
          is_verified?: boolean;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          phone?: string | null;
          password_hash?: string | null;
          role?: UserRole;
          is_verified?: boolean;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      orders_bookings: {
        Row: {
          id: string;
          client_id: string;
          package_name: PackageName;
          event_date: string;
          event_type: EventType;
          total_amount: number;
          balance_due: number;
          status: BookingStatus;
          delivery_estimate_days: number;
          venue_location: string | null;
          special_instructions: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          package_name: PackageName;
          event_date: string;
          event_type: EventType;
          total_amount: number;
          balance_due: number;
          status?: BookingStatus;
          delivery_estimate_days?: number;
          venue_location?: string | null;
          special_instructions?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          package_name?: PackageName;
          event_date?: string;
          event_type?: EventType;
          total_amount?: number;
          balance_due?: number;
          status?: BookingStatus;
          delivery_estimate_days?: number;
          venue_location?: string | null;
          special_instructions?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      payments_emi: {
        Row: {
          id: string;
          order_id: string;
          installment_no: number;
          due_date: string;
          amount: number;
          status: PaymentStatus;
          transaction_ref: string | null;
          paid_at: string | null;
          payment_method: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          installment_no: number;
          due_date: string;
          amount: number;
          status?: PaymentStatus;
          transaction_ref?: string | null;
          paid_at?: string | null;
          payment_method?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          installment_no?: number;
          due_date?: string;
          amount?: number;
          status?: PaymentStatus;
          transaction_ref?: string | null;
          paid_at?: string | null;
          payment_method?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      invoices: {
        Row: {
          id: string;
          order_id: string;
          invoice_number: string;
          generated_date: string;
          pdf_url: string | null;
          payment_status: InvoicePaymentStatus;
          subtotal: number;
          tax_amount: number;
          total_amount: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          invoice_number: string;
          generated_date?: string;
          pdf_url?: string | null;
          payment_status?: InvoicePaymentStatus;
          subtotal?: number;
          tax_amount?: number;
          total_amount?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          invoice_number?: string;
          generated_date?: string;
          pdf_url?: string | null;
          payment_status?: InvoicePaymentStatus;
          subtotal?: number;
          tax_amount?: number;
          total_amount?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      verification_tokens: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          otp_code_hash: string;
          token_type: string;
          expires_at: string;
          attempts: number;
          max_attempts: number;
          is_used: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email: string;
          otp_code_hash: string;
          token_type?: string;
          expires_at: string;
          attempts?: number;
          max_attempts?: number;
          is_used?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email?: string;
          otp_code_hash?: string;
          token_type?: string;
          expires_at?: string;
          attempts?: number;
          max_attempts?: number;
          is_used?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
      package_tier: PackageName;
      event_type: EventType;
      booking_status: BookingStatus;
      payment_status: PaymentStatus;
      invoice_status: InvoicePaymentStatus;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
