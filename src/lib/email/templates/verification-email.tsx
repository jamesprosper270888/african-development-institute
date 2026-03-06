import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
  Section,
} from "@react-email/components";

export function VerificationEmail({
  name,
  url,
}: {
  name: string;
  url: string;
}) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "sans-serif", backgroundColor: "#FAF8F5" }}>
        <Container
          style={{
            maxWidth: "560px",
            margin: "0 auto",
            padding: "40px 20px",
          }}
        >
          <Text style={{ fontSize: "20px", fontWeight: "bold", color: "#1C1C1C" }}>
            African Development Institute
          </Text>
          <Section style={{ marginTop: "24px" }}>
            <Text style={{ fontSize: "16px", color: "#1C1C1C" }}>
              Hello {name},
            </Text>
            <Text style={{ fontSize: "16px", color: "#1C1C1C" }}>
              Please verify your email address by clicking the link below:
            </Text>
            <Link
              href={url}
              style={{
                display: "inline-block",
                backgroundColor: "#C8102E",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "6px",
                textDecoration: "none",
                fontSize: "16px",
                fontWeight: "500",
                marginTop: "16px",
              }}
            >
              Verify Email Address
            </Link>
            <Text
              style={{ fontSize: "14px", color: "#6b6560", marginTop: "24px" }}
            >
              If the button above does not work, copy and paste this URL into
              your browser: {url}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
