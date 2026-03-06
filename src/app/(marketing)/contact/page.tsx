import type { Metadata } from "next";
import { Section } from "@/components/shared/section";
import { Container } from "@/components/shared/container";
import { Heading } from "@/components/shared/heading";
import { EnquiryForm } from "@/components/forms/enquiry-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the African Development Institute. General enquiries, membership, leadership programme, or organisational partnerships.",
};

export default function ContactPage() {
  return (
    <>
      <Section variant="offwhite">
        <Container>
          <div className="mx-auto max-w-xl">
            <div className="text-center">
              <Heading as="h1">Get in Touch</Heading>
              <p className="mt-4 text-lg text-muted-foreground">
                Whether you have a question, want to explore membership, or are
                interested in working with ADI — we&apos;d love to hear from
                you.
              </p>
            </div>

            <div className="mt-12">
              <EnquiryForm type="general" showTypeSelector />
            </div>

            <div className="mt-12 text-center">
              <p className="text-sm text-muted-foreground">
                You can also reach us directly at
              </p>
              <a
                href="mailto:hello@africandevelopmentinstitute.org"
                className="mt-1 inline-block font-medium text-adi-green transition-colors hover:text-adi-green/80"
              >
                hello@africandevelopmentinstitute.org
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
