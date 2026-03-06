import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for the African Development Institute, a trading name of A D Imperative Ltd. How we collect, use, and protect your personal information.",
};

const tocItems = [
  { id: "information-we-collect", label: "1. What Information Do We Collect?" },
  { id: "sharing", label: "2. Will Your Information Be Shared?" },
  { id: "cookies", label: "3. Cookies and Tracking Technologies" },
  { id: "social-logins", label: "4. Social Logins" },
  { id: "international-transfers", label: "5. International Transfers" },
  { id: "third-party-websites", label: "6. Third-Party Websites" },
  { id: "retention", label: "7. How Long Do We Keep Your Information?" },
  { id: "security", label: "8. How Do We Keep Your Information Safe?" },
  { id: "your-rights", label: "9. What Are Your Privacy Rights?" },
  { id: "updates", label: "10. Do We Make Updates to This Policy?" },
  { id: "contact", label: "11. How Can You Contact Us?" },
];

export default function PrivacyPage() {
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

        <h1 className="font-heading text-4xl font-bold">Privacy Policy</h1>

        <p className="mb-6 mt-2 text-sm text-muted-foreground">
          <strong>Effective Date: 18th November 2024</strong>
          <br />
          <strong>A D Imperative Ltd</strong> (Company Number: 12467395),
          trading as <strong>African Development Institute</strong>
        </p>

        <p className="mb-4 text-base leading-relaxed">
          Thank you for choosing to be part of our community at the African
          Development Institute (&quot;company&quot;, &quot;we&quot;,
          &quot;us&quot;, or &quot;our&quot;), a trading name of A D Imperative
          Ltd. We are committed to protecting your personal information and your
          right to privacy. If you have any questions or concerns about our
          policy, or our practices with regards to your personal information,
          please contact us at{" "}
          <a
            href="mailto:support@africandevelopmentinstitute.com"
            className="text-adi-red hover:underline"
          >
            support@africandevelopmentinstitute.com
          </a>
          .
        </p>

        <p className="mb-4 text-base leading-relaxed">
          When you visit our site and use our services, you trust us with your
          personal information. We take your privacy very seriously. In this
          privacy notice, we describe our privacy policy. We seek to explain to
          you in the clearest way possible what information we collect, how we
          use it, and what rights you have in relation to it. We hope you take
          some time to read through it carefully, as it is important. If there
          are any terms in this privacy policy that you do not agree with, please
          discontinue use of our website and our services.
        </p>

        <p className="mb-6 text-base leading-relaxed">
          This privacy policy applies to all information collected through our
          website and/or any related services, sales, marketing, or events
          (collectively referred to in this privacy policy as the
          &quot;Sites&quot;).
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

        {/* Section 1 */}
        <h2
          id="information-we-collect"
          className="mt-10 mb-4 text-2xl font-semibold"
        >
          1. What Information Do We Collect?
        </h2>

        <h3 className="mt-6 mb-3 text-xl font-medium">
          Personal Information You Disclose to Us
        </h3>
        <p className="mb-4 text-base leading-relaxed">
          <strong>In Short:</strong> We collect personal information that you
          provide to us, such as your name, contact details, and payment
          information.
        </p>
        <p className="mb-4 text-base leading-relaxed">
          We collect personal information that you voluntarily provide to us when
          registering, expressing interest in our services, participating in
          activities (such as forums, competitions, or giveaways), or otherwise
          contacting us. The personal information we collect may include:
        </p>
        <ul className="mb-4 list-inside list-disc space-y-2">
          <li className="text-base leading-relaxed">
            <strong>Name and Contact Data:</strong> Your first and last name,
            email address, postal address, phone number, and other similar
            contact details.
          </li>
          <li className="text-base leading-relaxed">
            <strong>Credentials:</strong> Passwords and similar security
            information used for authentication and account access.
          </li>
          <li className="text-base leading-relaxed">
            <strong>Payment Data:</strong> Payment details such as credit card
            numbers, security codes, and billing addresses (processed securely by
            our payment processor).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-xl font-medium">
          Information Automatically Collected
        </h3>
        <p className="mb-4 text-base leading-relaxed">
          <strong>In Short:</strong> Some information &mdash; such as your IP
          address and device characteristics &mdash; is collected automatically
          when you visit our Sites.
        </p>
        <p className="mb-4 text-base leading-relaxed">
          We automatically collect certain technical information when you visit,
          use, or navigate the Sites. This may include device and usage
          information, such as IP addresses, browser types, operating systems,
          language preferences, and referring URLs.
        </p>
        <p className="mb-4 text-base leading-relaxed">
          Like many businesses, we use cookies and similar technologies to
          enhance functionality and improve user experience.
        </p>

        <h3 className="mt-6 mb-3 text-xl font-medium">
          Information Collected from Other Sources
        </h3>
        <p className="mb-4 text-base leading-relaxed">
          <strong>In Short:</strong> We may collect limited data from public
          databases, partners, or third-party providers. Examples include social
          media profile information, marketing leads, and publicly available
          data.
        </p>

        {/* Section 2 */}
        <h2 id="sharing" className="mt-10 mb-4 text-2xl font-semibold">
          2. Will Your Information Be Shared With Anyone?
        </h2>
        <p className="mb-4 text-base leading-relaxed">
          <strong>In Short:</strong> We only share information with your consent,
          to comply with laws, or to fulfill business obligations.
        </p>
        <p className="mb-4 text-base leading-relaxed">
          We may share or process your data under the following circumstances:
        </p>
        <ul className="mb-4 list-inside list-disc space-y-2">
          <li className="text-base leading-relaxed">
            <strong>With Vendors and Service Providers:</strong> For payment
            processing, customer support, marketing, or analytics.
          </li>
          <li className="text-base leading-relaxed">
            <strong>For Legal Obligations:</strong> To comply with applicable law
            or legal processes.
          </li>
          <li className="text-base leading-relaxed">
            <strong>With Affiliates and Business Partners:</strong> For joint
            projects, promotions, or internal operations.
          </li>
        </ul>

        {/* Section 3 */}
        <h2 id="cookies" className="mt-10 mb-4 text-2xl font-semibold">
          3. Do We Use Cookies and Other Tracking Technologies?
        </h2>
        <p className="mb-4 text-base leading-relaxed">
          <strong>In Short:</strong> Yes, we use cookies and other tracking
          technologies to enhance your experience. You can manage your cookie
          preferences through your browser settings.
        </p>

        {/* Section 4 */}
        <h2 id="social-logins" className="mt-10 mb-4 text-2xl font-semibold">
          4. How Do We Handle Your Social Logins?
        </h2>
        <p className="mb-4 text-base leading-relaxed">
          <strong>In Short:</strong> If you use social media logins, we may
          access limited profile data as permitted by the provider. This data is
          used only for purposes outlined in this policy.
        </p>

        {/* Section 5 */}
        <h2
          id="international-transfers"
          className="mt-10 mb-4 text-2xl font-semibold"
        >
          5. Is Your Information Transferred Internationally?
        </h2>
        <p className="mb-4 text-base leading-relaxed">
          <strong>In Short:</strong> We may process your information in countries
          outside of your own. Where required, we implement safeguards to protect
          your data during international transfers.
        </p>

        {/* Section 6 */}
        <h2
          id="third-party-websites"
          className="mt-10 mb-4 text-2xl font-semibold"
        >
          6. What Is Our Stance on Third-Party Websites?
        </h2>
        <p className="mb-4 text-base leading-relaxed">
          <strong>In Short:</strong> We are not responsible for third-party
          content or their privacy practices. We recommend reviewing third-party
          privacy policies before engaging with their services.
        </p>

        {/* Section 7 */}
        <h2 id="retention" className="mt-10 mb-4 text-2xl font-semibold">
          7. How Long Do We Keep Your Information?
        </h2>
        <p className="mb-4 text-base leading-relaxed">
          <strong>In Short:</strong> We retain data only as long as necessary for
          legitimate business or legal purposes. When no longer needed, your data
          will be securely deleted or anonymised.
        </p>

        {/* Section 8 */}
        <h2 id="security" className="mt-10 mb-4 text-2xl font-semibold">
          8. How Do We Keep Your Information Safe?
        </h2>
        <p className="mb-4 text-base leading-relaxed">
          <strong>In Short:</strong> We implement technical and organizational
          security measures to safeguard your data. However, no system can
          guarantee absolute security. Please use the Sites in a secure
          environment.
        </p>

        {/* Section 9 */}
        <h2 id="your-rights" className="mt-10 mb-4 text-2xl font-semibold">
          9. What Are Your Privacy Rights?
        </h2>
        <p className="mb-4 text-base leading-relaxed">
          <strong>In Short:</strong> You may review, update, or delete your
          personal information at any time.
        </p>
        <p className="mb-4 text-base leading-relaxed">
          Residents of the European Economic Area (EEA) have additional rights
          under GDPR, such as data access and portability.
        </p>
        <p className="mb-4 text-base leading-relaxed">
          To exercise your rights, contact us at{" "}
          <a
            href="mailto:support@africandevelopmentinstitute.com"
            className="text-adi-red hover:underline"
          >
            support@africandevelopmentinstitute.com
          </a>
          .
        </p>

        {/* Section 10 */}
        <h2 id="updates" className="mt-10 mb-4 text-2xl font-semibold">
          10. Do We Make Updates to This Policy?
        </h2>
        <p className="mb-4 text-base leading-relaxed">
          <strong>In Short:</strong> Yes, this policy may be updated periodically
          to reflect changes in our practices or applicable laws. We will notify
          you of material updates by posting a notice on our website.
        </p>

        {/* Section 11 */}
        <h2 id="contact" className="mt-10 mb-4 text-2xl font-semibold">
          11. How Can You Contact Us About This Policy?
        </h2>
        <p className="mb-4 text-base leading-relaxed">
          If you have questions or comments about this policy, please contact us:
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
