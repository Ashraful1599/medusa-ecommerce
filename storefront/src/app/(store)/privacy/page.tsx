import type { Metadata } from "next"
import { Container } from "@/components/layout/Container"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Nexly collects, uses, and protects your personal information.",
}

export default function PrivacyPage() {
  return (
    <>
      <div className="bg-[#111111] py-12 text-center">
        <h1 className="text-3xl font-black text-white">Privacy Policy</h1>
        <p className="text-white/50 text-sm mt-2">Last updated: March 19, 2026</p>
      </div>

      <Container className="py-12">
        <div className="max-w-3xl mx-auto prose prose-sm prose-gray">
          <div className="space-y-10 text-[#444444] text-sm leading-relaxed">

            <section>
              <h2 className="text-lg font-bold text-[#111111] mb-3">1. Information We Collect</h2>
              <p>We collect information you provide directly to us, including name, email address, shipping address, payment information, and any other information you choose to provide when placing an order or creating an account.</p>
              <p className="mt-3">We also automatically collect certain information when you visit our site, including your IP address, browser type, pages visited, and referring URLs.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#111111] mb-3">2. How We Use Your Information</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>To process and fulfil your orders</li>
                <li>To send order confirmations, shipping updates, and receipts</li>
                <li>To respond to your comments and questions</li>
                <li>To send marketing communications (with your consent)</li>
                <li>To improve our products, services, and website experience</li>
                <li>To detect and prevent fraudulent transactions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#111111] mb-3">3. Sharing of Information</h2>
              <p>We do not sell, trade, or rent your personal information to third parties. We may share your information with:</p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li><strong>Service providers</strong> — payment processors, shipping carriers, and email providers who assist us in operating our business</li>
                <li><strong>Legal requirements</strong> — when required by law or to protect our rights</li>
                <li><strong>Business transfers</strong> — in the event of a merger, acquisition, or sale of assets</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#111111] mb-3">4. Cookies</h2>
              <p>We use cookies and similar tracking technologies to improve your browsing experience, analyse site traffic, and understand where visitors come from. You can control cookie settings through your browser preferences.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#111111] mb-3">5. Data Security</h2>
              <p>We implement industry-standard security measures to protect your personal information. All payment transactions are encrypted using SSL technology. However, no method of internet transmission is 100% secure.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#111111] mb-3">6. Your Rights</h2>
              <p>You have the right to access, update, or delete your personal information at any time. To exercise these rights, contact us at <a href="mailto:privacy@nexly.com" className="text-[#111111] font-semibold underline">privacy@nexly.com</a>.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#111111] mb-3">7. Children&apos;s Privacy</h2>
              <p>Our services are not directed to individuals under the age of 16. We do not knowingly collect personal information from children.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#111111] mb-3">8. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page with an updated date.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#111111] mb-3">9. Contact Us</h2>
              <p>If you have questions about this Privacy Policy, please contact us at <a href="mailto:privacy@nexly.com" className="text-[#111111] font-semibold underline">privacy@nexly.com</a> or visit our <a href="/contact" className="text-[#111111] font-semibold underline">Contact page</a>.</p>
            </section>

          </div>
        </div>
      </Container>
    </>
  )
}
