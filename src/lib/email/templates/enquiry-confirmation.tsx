import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
} from "@react-email/components";

const typeMessages: Record<string, string> = {
  general:
    "Thank you for reaching out to the African Development Institute. We've received your enquiry and will get back to you shortly.",
  membership:
    "Thank you for your interest in ADI membership. We've received your details and will be in touch soon with next steps.",
  organisation:
    "Thank you for your interest in working with ADI. We've received your enquiry and will arrange a conversation with you shortly.",
  leadership:
    "Thank you for your interest in the ADI Leadership Programme. We've received your details and will be in touch to arrange an initial conversation.",
};

export function EnquiryConfirmation({
  name,
  type,
}: {
  name: string;
  type: string;
}) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "sans-serif", backgroundColor: "#FAF8F5" }}>
        <Container style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 600 }}>
            Thank you, {name}
          </Text>
          <Hr />
          <Section>
            <Text>{typeMessages[type] || typeMessages.general}</Text>
            <Text>
              In the meantime, if you have any questions, feel free to reply to
              this email.
            </Text>
            <Hr />
            <Text style={{ fontSize: 12, color: "#6b6560" }}>
              African Development Institute
              <br />A Prospect Connect Media initiative
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
