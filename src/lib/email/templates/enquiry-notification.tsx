import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
} from "@react-email/components";

export function EnquiryNotification({
  name,
  email,
  type,
  message,
  timestamp,
}: {
  name: string;
  email: string;
  type: string;
  message: string;
  timestamp: string;
}) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "sans-serif", backgroundColor: "#FAF8F5" }}>
        <Container style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 600 }}>
            New {type} enquiry from {name}
          </Text>
          <Hr />
          <Section>
            <Text>
              <strong>Name:</strong> {name}
            </Text>
            <Text>
              <strong>Email:</strong> {email}
            </Text>
            <Text>
              <strong>Type:</strong> {type}
            </Text>
            <Text>
              <strong>Message:</strong>
            </Text>
            <Text style={{ whiteSpace: "pre-wrap" }}>{message}</Text>
            <Hr />
            <Text style={{ fontSize: 12, color: "#6b6560" }}>
              Received at {timestamp}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
