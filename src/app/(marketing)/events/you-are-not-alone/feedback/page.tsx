import type { Metadata } from "next";
import { Section } from "@/components/shared/section";
import { Container } from "@/components/shared/container";
import { Heading } from "@/components/shared/heading";
import { EventFeedbackForm } from "@/components/forms/event-feedback-form";
import { EVENT } from "@/lib/event-config";

// Only for people who were in the room, reached from the event page and the
// follow-up email, so it is kept out of search (and out of the sitemap).
export const metadata: Metadata = {
  title: `Your feedback: ${EVENT.name}`,
  description: `Tell Pam and Marcia about your day at ${EVENT.name}, ${EVENT.dateLong}.`,
  robots: { index: false, follow: false },
};

export default function EventFeedbackPage() {
  return (
    <>
      <Section variant="dark" className="py-14 md:py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-adi-red">
              {EVENT.name} &middot; {EVENT.dateShort}
            </p>
            <Heading as="h1" className="mt-4 text-4xl md:text-5xl">
              Tell us about your day.
            </Heading>
            <p className="mt-6 text-lg leading-relaxed text-white/80">
              Thank you for being there. A few minutes of your honest thoughts
              will shape the next gathering, and help someone who is still on
              their own decide to walk into the room.
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mx-auto max-w-2xl">
            <EventFeedbackForm />
          </div>
        </Container>
      </Section>
    </>
  );
}
