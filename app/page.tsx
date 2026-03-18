import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { RealisationsSection } from "@/components/realisations-section";
import { ServicesSection } from "@/components/services-section";
import { TrustSection } from "@/components/trust-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { TeamSection } from "@/components/team-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <RealisationsSection />
      <ServicesSection />
      <TrustSection />
      <TestimonialsSection />
      <TeamSection />
      <ContactSection />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
