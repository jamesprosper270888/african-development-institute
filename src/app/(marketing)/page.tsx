import type { Metadata } from "next";
import {
  Hero,
  ThreeStrands,
  ValuesSection,
  TestimonialsPlaceholder,
  AnchoringStatement,
  CtaBanner,
} from "@/components/landing";

export const metadata: Metadata = {
  description:
    "ADI is a community-based leadership organisation for Black people. Supporting growth, developing confident leaders, enabling collective progress.",
};

// Static JSON-LD - no user input, safe to inline
const jsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "African Development Institute",
  alternateName: "ADI",
  description:
    "A community-based leadership organisation for Black people. Membership, leadership development, and organisational partnerships.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://africandevelopmentinstitute.org",
  foundingDate: "2025",
  founder: [
    { "@type": "Person", name: "Pam Rowe" },
    { "@type": "Person", name: "Marcia Daigo" },
  ],
  sameAs: [],
});

export default function HomePage() {
  return (
    <>
      {/* Static structured data - no user input, XSS-safe */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <Hero />
      <ThreeStrands />
      <ValuesSection />
      <TestimonialsPlaceholder />
      <AnchoringStatement />
      <CtaBanner
        heading="Ready to begin?"
        description="Whether you're exploring membership, leadership development, or organisational partnerships — we'd love to hear from you."
        primaryHref="/contact"
        primaryLabel="Get in Touch"
        secondaryHref="/membership"
        secondaryLabel="Explore Membership"
      />
    </>
  );
}
