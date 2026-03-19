import type { Metadata } from "next"
import { Container } from "@/components/layout/Container"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms and conditions that govern your use of Nexly.",
}

export default function TermsPage() {
  return (
    <>
      <div className="bg-[#111111] py-12 text-center">
        <h1 className="text-3xl font-black text-white">Terms of Service</h1>
        <p className="text-white/50 text-sm mt-2">Last updated: March 19, 2026</p>
      </div>

      <Container className="py-12">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-10 text-[#444444] text-sm leading-relaxed">

            <section>
              <h2 className="text-lg font-bold text-[#111111] mb-3">1. Acceptance of Terms</h2>
              <p>By accessing or using Nexly, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our services.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#111111] mb-3">2. Use of Our Services</h2>
              <p>You may use Nexly only for lawful purposes and in accordance with these Terms. You agree not to:</p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li>Use the site in any way that violates applicable laws or regulations</li>
                <li>Attempt to gain unauthorised access to any part of our platform</li>
                <li>Transmit any unsolicited or unauthorised advertising or spam</li>
                <li>Use any automated tools to scrape or copy content from our site</li>
                <li>Impersonate any person or entity</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#111111] mb-3">3. Account Responsibilities</h2>
              <p>You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. Notify us immediately at <a href="mailto:support@nexly.com" className="text-[#111111] font-semibold underline">support@nexly.com</a> of any unauthorised use of your account.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#111111] mb-3">4. Orders & Payments</h2>
              <p>By placing an order, you agree to provide accurate and complete payment information. All prices are displayed in USD and are subject to change without notice. We reserve the right to cancel or refuse any order at our discretion.</p>
              <p className="mt-3">Orders are not confirmed until you receive an order confirmation email. We are not responsible for pricing errors and reserve the right to cancel orders placed at incorrect prices.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#111111] mb-3">5. Shipping & Delivery</h2>
              <p>Delivery timeframes are estimates and not guaranteed. Nexly is not responsible for delays caused by shipping carriers, customs, or circumstances beyond our control. Risk of loss and title for items pass to you upon delivery.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#111111] mb-3">6. Returns & Refunds</h2>
              <p>Our return policy is described in full on our <a href="/help#returns" className="text-[#111111] font-semibold underline">Help Center</a>. Refunds are issued to the original payment method. We reserve the right to refuse returns that do not meet our return conditions.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#111111] mb-3">7. Intellectual Property</h2>
              <p>All content on Nexly — including text, graphics, logos, images, and software — is the property of Nexly and protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#111111] mb-3">8. Limitation of Liability</h2>
              <p>To the maximum extent permitted by law, Nexly shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services or products.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#111111] mb-3">9. Governing Law</h2>
              <p>These Terms shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflict of law provisions.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#111111] mb-3">10. Changes to Terms</h2>
              <p>We reserve the right to modify these Terms at any time. We will provide notice of significant changes by updating the date at the top of this page. Your continued use of Nexly after changes constitutes acceptance of the new Terms.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#111111] mb-3">11. Contact</h2>
              <p>Questions about these Terms? Contact us at <a href="mailto:legal@nexly.com" className="text-[#111111] font-semibold underline">legal@nexly.com</a> or visit our <a href="/contact" className="text-[#111111] font-semibold underline">Contact page</a>.</p>
            </section>

          </div>
        </div>
      </Container>
    </>
  )
}
