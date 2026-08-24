import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MetricsBar } from './components/MetricsBar';
import { ServicesSection } from './components/ServicesSection';
import { LectureFunnelSpotlight } from './components/LectureFunnelSpotlight';
import { HowItWorksSection } from './components/HowItWorksSection';
import { RoiCalculator } from './components/RoiCalculator';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FaqSection } from './components/FaqSection';
import { ContactForm } from './components/ContactForm';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

export const App: React.FC = () => {
  const [selectedService, setSelectedService] = useState<string>('Gestão de Tráfego Pago & Performance');

  const handleSelectService = (serviceName: string) => {
    setSelectedService(serviceName);
  };

  return (
    <div className="min-h-screen bg-[#fcf8f8] text-[#1c1b1b] flex flex-col font-sans selection:bg-[#0050d7] selection:text-white">
      {/* Top Fixed Navbar */}
      <Navbar />

      {/* Main Sections Content */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <HeroSection onSelectService={handleSelectService} />

        {/* 2. Metrics & Presence Bar */}
        <MetricsBar />

        {/* 3. Detailed Services Grid (9 Solutions) */}
        <ServicesSection onSelectService={handleSelectService} />

        {/* 4. Special Lecture Funnel Feature */}
        <LectureFunnelSpotlight onSelectService={handleSelectService} />

        {/* 5. How It Works Step-by-Step */}
        <HowItWorksSection />

        {/* 6. Interactive ROI Calculator */}
        <RoiCalculator />

        {/* 7. Client Testimonials & Results */}
        <TestimonialsSection />

        {/* 8. Lead Capture Form with Supabase Sync & WhatsApp redirect */}
        <ContactForm selectedServicePreset={selectedService} />

        {/* 9. FAQ Section */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Quick Floating WhatsApp Button */}
      <FloatingWhatsApp />
    </div>
  );
};
