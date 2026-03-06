import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for the African Development Institute, a trading name of A D Imperative Ltd. Governing your use of our website and services.",
};

const tocItems = [
  { id: "introduction", label: "1. Introduction" },
  { id: "eligibility", label: "2. Eligibility" },
  { id: "educational-guidance", label: "3. Educational Guidance Disclaimer" },
  { id: "use-of-website", label: "4. Use of the Website" },
  { id: "intellectual-property", label: "5. Intellectual Property" },
  { id: "limitation-of-liability", label: "6. Limitation of Liability" },
  { id: "data-privacy", label: "7. Data Privacy and Security" },
  { id: "third-party-links", label: "8. Links to Third Parties" },
  { id: "changes", label: "9. Changes to the Terms" },
  { id: "governing-law", label: "10. Governing Law" },
  { id: "contact", label: "11. Contact Information" },
];

export default function TermsPage() {
  return (
    <article className="py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-3xl px-6">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-adi-red"
        >
          <span>&larr;</span>
          <span>Back to Home</span>
        </Link>

        <h1 className="font-heading text-4xl font-bold">Terms of Service</h1>

        <p className="mb-6 mt-2 text-sm text-muted-foreground">
          <strong>Effective Date: 18th November 2024</strong>
          <br />
          <strong>A D Imperative Ltd</strong> (Company Number: 12467395),
          trading as <strong>African Development Institute</strong>
        </p>

        <p className="mb-6 text-base leading-relaxed">
          Welcome to the African Development Institute, a trading name of A D
          Imperative Ltd. By accessing or using our website and services, you
          agree to comply with and be bound by the following terms and
          conditions. Please read them carefully. If you do not agree, you should
          not use our services.
        </p>

        <div className="mb-10 rounded-lg border border-border p-6">
          <h2 className="mb-4 text-lg font-semibold">Table of Contents</h2>
          <nav className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {tocItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-sm text-adi-red hover:underline"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <h2 id="introduction" className="mt-10 mb-4 text-2xl font-semibold">
          1. Introduction
        </h2>
        <p className="mb-4 text-base leading-relaxed">
          1.1. The African Development Institute operates as a trading name for
          A D Imperative Ltd (Company Number: 12467395), registered in England
          and Wales.
        </p>
        <p className="mb-4 text-base leading-relaxed">
          1.2. The registered office address is 20-22 Wenlock Road, London,
          England, N1 7GU.
        </p>
        <p className="mb-4 text-base leading-relaxed">
          1.3. These Terms of Service govern your use of the African Development
          Institute&apos;s website, content, and services, including community
          resources and educational materials (&quot;Services&quot;).
        </p>
        <p className="mb-4 text-base leading-relaxed">
          1.4. The African Development Institute does not provide investment,
          legal, or tax advisory services. Our platform is strictly educational,
          designed to empower individuals through learning and community
          engagement.
        </p>

        <h2 id="eligibility" className="mt-10 mb-4 text-2xl font-semibold">
          2. Eligibility
        </h2>
        <p className="mb-4 text-base leading-relaxed">
          2.1. You must be at least 18 years old to use the Services.
        </p>
        <p className="mb-4 text-base leading-relaxed">
          2.2. By using the Services, you confirm that you meet the eligibility
          criteria for participation.
        </p>
        <p className="mb-4 text-base leading-relaxed">
          2.3. The Services are not suitable for individuals seeking regulated
          financial, legal, or tax advice.
        </p>

        <h2
          id="educational-guidance"
          className="mt-10 mb-4 text-2xl font-semibold"
        >
          3. Educational Guidance Disclaimer
        </h2>
        <p className="mb-4 text-base leading-relaxed">
          3.1. The African Development Institute does not offer regulated
          financial advice or services.
        </p>
        <p className="mb-4 text-base leading-relaxed">
          3.2. All content is for informational and educational purposes only and
          should not be construed as professional advice.
        </p>
        <p className="mb-4 text-base leading-relaxed">
          3.3. You are encouraged to consult qualified professionals for specific
          advice tailored to your circumstances.
        </p>

        <h2 id="use-of-website" className="mt-10 mb-4 text-2xl font-semibold">
          4. Use of the Website
        </h2>
        <p className="mb-4 text-base leading-relaxed">
          4.1. You are only permitted to use the website for lawful personal,
          non-commercial purposes.
        </p>
        <p className="mb-4 text-base leading-relaxed">4.2. You must not:</p>
        <ul className="mb-4 list-inside list-disc space-y-2">
          <li className="text-base leading-relaxed">
            Use the website for fraudulent, malicious, or unauthorized purposes.
          </li>
          <li className="text-base leading-relaxed">
            Post harmful or unlawful material, including viruses or offensive
            content.
          </li>
          <li className="text-base leading-relaxed">
            Interfere with the operation or functionality of the website.
          </li>
        </ul>

        <h2
          id="intellectual-property"
          className="mt-10 mb-4 text-2xl font-semibold"
        >
          5. Intellectual Property
        </h2>
        <p className="mb-4 text-base leading-relaxed">
          5.1. All content on the African Development Institute website,
          including text, graphics, logos, and software, is the intellectual
          property of A D Imperative Ltd and is protected by copyright law.
        </p>
        <p className="mb-4 text-base leading-relaxed">
          5.2. You may not reproduce, distribute, or modify any content without
          prior written consent from A D Imperative Ltd.
        </p>

        <h2
          id="limitation-of-liability"
          className="mt-10 mb-4 text-2xl font-semibold"
        >
          6. Limitation of Liability
        </h2>
        <p className="mb-4 text-base leading-relaxed">
          6.1. The African Development Institute provides its content and
          Services &quot;as is&quot; and disclaims all warranties, whether
          express or implied.
        </p>
        <p className="mb-4 text-base leading-relaxed">
          6.2. A D Imperative Ltd will not be liable for:
        </p>
        <ul className="mb-4 list-inside list-disc space-y-2">
          <li className="text-base leading-relaxed">
            Any loss or damage resulting from reliance on the information
            provided.
          </li>
          <li className="text-base leading-relaxed">
            Interruptions or unavailability of the Services.
          </li>
          <li className="text-base leading-relaxed">
            Indirect or consequential losses.
          </li>
        </ul>

        <h2 id="data-privacy" className="mt-10 mb-4 text-2xl font-semibold">
          7. Data Privacy and Security
        </h2>
        <p className="mb-4 text-base leading-relaxed">
          7.1. Your use of our Services is subject to our{" "}
          <Link href="/privacy" className="text-adi-red hover:underline">
            Privacy Policy
          </Link>
          , which outlines how your data is collected, stored, and used.
        </p>
        <p className="mb-4 text-base leading-relaxed">
          7.2. While we implement industry-standard security measures, we cannot
          guarantee complete security due to the inherent risks of internet use.
        </p>

        <h2
          id="third-party-links"
          className="mt-10 mb-4 text-2xl font-semibold"
        >
          8. Links to Third Parties
        </h2>
        <p className="mb-4 text-base leading-relaxed">
          8.1. The African Development Institute may include links to third-party
          websites for informational purposes.
        </p>
        <p className="mb-4 text-base leading-relaxed">
          8.2. We do not endorse or assume responsibility for the accuracy,
          completeness, or quality of third-party content or services.
        </p>

        <h2 id="changes" className="mt-10 mb-4 text-2xl font-semibold">
          9. Changes to the Terms
        </h2>
        <p className="mb-4 text-base leading-relaxed">
          9.1. The African Development Institute reserves the right to amend
          these Terms at any time.
        </p>
        <p className="mb-4 text-base leading-relaxed">
          9.2. Any updates will be posted on this page with the revised
          &quot;Effective Date.&quot;
        </p>
        <p className="mb-4 text-base leading-relaxed">
          9.3. Continued use of the Services constitutes your acceptance of the
          updated Terms.
        </p>

        <h2 id="governing-law" className="mt-10 mb-4 text-2xl font-semibold">
          10. Governing Law
        </h2>
        <p className="mb-4 text-base leading-relaxed">
          10.1. These Terms of Service are governed by the laws of England and
          Wales.
        </p>
        <p className="mb-4 text-base leading-relaxed">
          10.2. Any disputes arising under these Terms will be subject to the
          exclusive jurisdiction of the courts of England and Wales.
        </p>

        <h2 id="contact" className="mt-10 mb-4 text-2xl font-semibold">
          11. Contact Information
        </h2>
        <p className="mb-4 text-base leading-relaxed">
          If you have any questions regarding these Terms or wish to contact us:
        </p>
        <div className="rounded-lg bg-muted/50 p-4">
          <p className="mb-2 text-base leading-relaxed">
            <strong>A D Imperative Ltd</strong>
            <br />
            Trading as African Development Institute
          </p>
          <p className="mb-2 text-base leading-relaxed">
            Email:{" "}
            <a
              href="mailto:support@africandevelopmentinstitute.com"
              className="text-adi-red hover:underline"
            >
              support@africandevelopmentinstitute.com
            </a>
          </p>
          <p className="text-base leading-relaxed">
            Address: 20-22 Wenlock Road, London, England, N1 7GU
          </p>
        </div>

        <div className="mt-10 rounded-lg border border-border bg-muted/30 p-6">
          <h3 className="mb-2 font-semibold">Disclaimer</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The African Development Institute, a trading name of A D Imperative
            Ltd, is a community and educational platform and does not provide
            investment, legal, or tax advice. Always seek independent advice
            tailored to your circumstances.
          </p>
        </div>

        <div className="mt-12 text-center">
          <a
            href="#"
            className="text-sm text-muted-foreground transition-colors hover:text-adi-red"
          >
            Back to top &uarr;
          </a>
        </div>
      </div>
    </article>
  );
}
