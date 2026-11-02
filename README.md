# MAHAKALI PRODUCTION — Modern Vite + React SPA

Production-ready, high-end cinematic studio Single Page Application (SPA) for **MAHAKALI PRODUCTION**, refactored into **Vite + React (TypeScript) + Tailwind CSS + Lucide React + Supabase**, optimized for direct deployment on **Hostinger Shared Web Hosting** via the `dist` folder.

---

## 🏛️ Verified Brand Credentials & Studio Information

| Detail | Official Information |
| :--- | :--- |
| **Brand Name** | **MAHAKALI PRODUCTION** |
| **Founder & Creative Director** | **Vishal Giri** |
| **Physical Studio Address** | **Soni Plaza, Near by Railway Station, Shujalpur, Madhya Pradesh - 465333** |
| **Phone / WhatsApp** | **+91 8719878719** |
| **Official Email** | **mahakaliproduction69@gmail.com** |
| **Instagram Handle** | **[@mahakali_productionstudio](https://instagram.com/mahakali_productionstudio)** |
| **Signature Packages** | Mahakali Plus Full HD, Mahakali Pro 4K, Mahakali Max Asli 4K, Mahakali Ultra Asli 4K, and Pre-Wedding packages |

---

## 🚀 Key Migration & Refactoring Highlights

1. **Clean Vite + React + TypeScript Architecture**:
   - Replaced Next.js App Router, SSR, and Node server runtimes with a high-performance, client-side Vite SPA.
   - Replaced `next/link` with `Link` and `useNavigate` from `react-router-dom` (v6).
   - Replaced `next/navigation` (`useRouter`, `usePathname`) with `useLocation` and `useNavigate`.
   - Replaced `next/image` with responsive, modern HTML5 lazy-loaded elements.
   - Replaced Server Actions with direct client-side **Supabase SDK** calls (`supabase.auth.signInWithPassword`, `signUp`, `verifyOtp`, and PostgreSQL RLS queries).

2. **React Router DOM v6 Route Hierarchy**:
   - **Public Routes**:
     - `/`: Cinematic Studio Portfolio with founder highlight, featured films, studio equipment, and physical location map card.
     - `/packages`: Complete comparison matrix across all 5 tiers (including EMI breakdown and turnaround times).
     - `/book-now`: Shoot consultation inquiry form with direct one-click WhatsApp dispatch to `+91 8719878719`.
   - **Authentication Routes**:
     - `/login`: Studio sign-in with instant one-click demo credentials for Vishal Giri (Admin) and VIP Client.
     - `/verify-email`: Mandatory 6-digit OTP verification screen with auto-advancing inputs and countdown resend timer.
   - **Protected Routes (`<ProtectedRoute />`)**:
     - `/admin/*`: Studio Executive Console restricted to Vishal Giri (Studio Owner / role: `'admin'`). Real-time order status manipulation, EMI tracking, and invoice downloads.
     - `/client-portal/*`: VIP Client Portal showing personal booked packages, milestone production countdown, EMI installment schedule, and tax receipts.

3. **Cinematic Smooth Scrolling & Animations**:
   - Integrated **Lenis** 60fps smooth momentum scrolling for dark luxury fluidity.
   - **Framer Motion** transitions on hero typography and package cards.

4. **Hostinger Shared Web Hosting Ready**:
   - Includes production `.htaccess` in `public/` that automatically copies to `dist/.htaccess` on `npm run build`.
   - Configured with Apache `mod_rewrite` to route all dynamic client paths (`/packages`, `/book-now`, `/admin`, etc.) directly to `index.html` without 404 errors.

---

## 📂 Project Directory Structure

```text
mahakali-production/
├── dist/                          # Production build output (Ready to upload to Hostinger)
│   ├── assets/                    # Optimized, chunked JS & CSS bundles
│   ├── .htaccess                  # Apache client-side routing rewrite rules
│   └── index.html                 # Minified entry point
├── public/
│   └── .htaccess                  # Hostinger Apache rewrite configuration
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── ProtectedRoute.tsx # RBAC & Email Verification Guard
│   │   └── layout/
│   │       ├── Navbar.tsx         # Header navigation with WhatsApp concierge link
│   │       ├── Footer.tsx         # Studio footer with Shujalpur coordinates
│   │       └── SmoothScroll.tsx   # Lenis smooth scroll provider
│   ├── config/
│   │   └── brand.ts               # Verified brand data, founder info & packages
│   ├── context/
│   │   └── AuthContext.tsx        # Client Supabase Auth, OTP, and session state
│   ├── hooks/
│   │   └── useStudioData.ts       # Orders, EMI ledger, and invoice data hook
│   ├── lib/
│   │   └── supabase.ts            # Typed Supabase browser client
│   ├── pages/
│   │   ├── Home.tsx               # Cinematic Portfolio
│   │   ├── Packages.tsx           # Full Package Matrix
│   │   ├── BookNow.tsx            # Shoot Consultation & WhatsApp dispatch
│   │   ├── Login.tsx              # Portal Sign In & Registration
│   │   ├── VerifyEmail.tsx        # 6-Digit OTP Verification Screen
│   │   ├── AdminDashboard.tsx     # Studio Owner Executive Console
│   │   └── ClientPortal.tsx       # VIP Client Private View
│   ├── types/
│   │   ├── auth.ts                # Auth types & session definitions
│   │   └── database.ts            # Supabase PostgreSQL schema interfaces
│   ├── App.tsx                    # React Router DOM configuration
│   ├── index.css                  # Studio styling, gold shimmer & scrollbars
│   ├── main.tsx                   # React root entry point
│   └── vite-env.d.ts              # Vite environment typings
├── index.html                     # Root HTML template
├── package.json                   # Vite & React dependencies
├── tailwind.config.ts             # Obsidian & luxury gold color tokens
├── tsconfig.json                  # Strict TypeScript configuration
└── vite.config.ts                 # Vite bundler, chunking & alias setup
```

---

## 🌐 Deploying to Hostinger Shared Web Hosting

1. **Build the Production Artifact**:
   ```bash
   npm run build
   ```
   This generates the optimized `dist/` directory containing `index.html`, `assets/`, and `.htaccess`.

2. **Upload to Hostinger File Manager**:
   - Log into your **Hostinger hPanel**.
   - Navigate to **Files > File Manager** for your domain.
   - Open the `public_html` directory.
   - Upload the entire contents of the local `dist/` folder directly into `public_html`.
   - Ensure the `.htaccess` file is present in `public_html`.

3. **Verify Apache Routing**:
   The provided `.htaccess` ensures that refreshing URLs like `https://yourdomain.com/packages` or `https://yourdomain.com/admin` will serve `index.html` without returning an Apache 404:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

---

## 🔑 One-Click Demo Credentials

Instant one-click demo login buttons are provided on the `/login` screen:

| Role | Email | Password | Access Route |
| :--- | :--- | :--- | :--- |
| **Studio Owner (Vishal Giri)** | `mahakaliproduction69@gmail.com` | `Mahakali@2026` | `/admin` |
| **VIP Client (Priya & Rahul)** | `priya.rahul@gmail.com` | `Mahakali@2026` | `/client-portal` |
