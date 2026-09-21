import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Button,
  Link,
  Hr,
} from "@react-email/components";
import { BOOK, bookUrl } from "@/lib/book-config";

const serif = "Georgia, 'Times New Roman', serif";

export function BookReservationConfirmation({ name }: { name: string }) {
  const firstName = name.trim().split(/\s+/)[0] || name;

  return (
    <Html>
      <Head />
      <Preview>Your copy of {BOOK.title} is reserved. The Introduction is inside.</Preview>
      <Body style={{ fontFamily: "sans-serif", backgroundColor: "#FAF8F5", color: "#1C1C1C" }}>
        <Container style={{ maxWidth: 560, margin: "0 auto", padding: "32px 20px" }}>
          <Text style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "#C8102E", margin: 0 }}>
            Founding reader
          </Text>
          <Text style={{ fontFamily: serif, fontSize: 26, lineHeight: "32px", margin: "8px 0 0" }}>
            Thank you, {firstName}. Your copy of {BOOK.title} is reserved.
          </Text>
          <Hr style={{ borderColor: "#E5E0D8", margin: "24px 0" }} />

          <Section>
            <Text style={{ fontSize: 16, lineHeight: "26px" }}>
              As one of our founding readers, the Introduction is yours to read
              now. It sets out the Third Way and the thinking behind the whole
              book.
            </Text>
            <Button
              href={bookUrl(BOOK.introductionPath)}
              style={{
                backgroundColor: "#C8102E",
                color: "#FFFFFF",
                fontSize: 15,
                fontWeight: 600,
                padding: "14px 28px",
                borderRadius: 6,
                textDecoration: "none",
              }}
            >
              Read the Introduction
            </Button>
            <Text style={{ fontSize: 16, lineHeight: "26px", marginTop: 24 }}>
              We have also put the six questions at the heart of the book on a
              card you can print and keep:{" "}
              <Link href={bookUrl(BOOK.questionsPath)} style={{ color: "#006B3F" }}>
                Six questions to carry
              </Link>
              .
            </Text>
            <Text style={{ fontSize: 16, lineHeight: "26px" }}>
              The book is still being written. We will write to you as it
              develops, and you will hear before anyone else when pre-orders
              open, with the price and the publication date.
            </Text>
            <Text style={{ fontSize: 16, lineHeight: "26px" }}>
              With warm wishes,
              <br />
              Pam and Marcia
            </Text>
          </Section>

          <Hr style={{ borderColor: "#E5E0D8", margin: "24px 0" }} />
          <Text style={{ fontSize: 12, lineHeight: "18px", color: "#6b6560" }}>
            You reserved a copy at {bookUrl().replace(/^https?:\/\//, "")}. Reply
            to this email to reach us, or to ask us to stop writing to you.
            <br />
            {BOOK.publisher}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
