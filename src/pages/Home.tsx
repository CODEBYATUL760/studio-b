// ==============================================================================
// MAHAKALI PRODUCTION - Public-Facing Cinema Studio Homepage
// Featuring:
// 1. Ambient Moving Studio Background (Apertures, Film Strips, Viewfinder HUD, Bokeh)
// 2. High-Impact Hero Section with 3D Cinema Canvas
// 3. Selected Portfolio Cinema Grid
// 4. Minimal Services Grid (Wedding Cinematography, Candid Photography, Pre-Wedding Shoot, Commercial)
// 5. Interactive DSLR Camera Photo-Print Packages Section
// 6. Genuine Client Reviews & Stories (100% Zero Fake Data)
// 7. Live 5-Stage Client Shoot Production Status Tracker
// 8. Minimalist Booking & Contact Section
// 100% Pure Monochrome Black & White (#09090B & #121215)
// ==============================================================================

import React from 'react';
import { AmbientStudioBackground } from '@/components/common/AmbientStudioBackground';
import { HeroSection } from '@/components/home/HeroSection';
import { Showcase3DTilt } from '@/components/3d/Showcase3DTilt';
import { ServicesSection } from '@/components/home/ServicesSection';
import { HomePackagesSection } from '@/components/home/HomePackagesSection';
import { ClientReviewsSection } from '@/components/home/ClientReviewsSection';
import { ShootStatusTracker } from '@/components/home/ShootStatusTracker';
import { ContactSection } from '@/components/home/ContactSection';

export const Home: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-[#09090B] text-[#FFFFFF] flex flex-col selection:bg-white/20 selection:text-white overflow-hidden">
      {/* Feature 1: Ambient Floating Background Canvas Layer */}
      <AmbientStudioBackground />

      {/* Main Content Layers */}
      <div className="relative z-10 space-y-12 sm:space-y-16">
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. Portfolio / Selected Works Grid */}
        <Showcase3DTilt />

        {/* 3. Minimal Services Grid */}
        <ServicesSection />

        {/* 4. Interactive DSLR Camera Photo-Print Packages */}
        <HomePackagesSection />

        {/* 5. Verified Client Reviews & Stories (Zero Fake Data) */}
        <ClientReviewsSection />

        {/* 6. Live 5-Stage Client Shoot Production Status Tracker */}
        <ShootStatusTracker />

        {/* 7. Minimal Contact / Date Reservation Strip */}
        <ContactSection />
      </div>
    </div>
  );
};
