import Link from "next/link"
import { Sparkles } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "AI Lesson Planner privacy policy - how we collect, use, and protect your data.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Sparkles className="h-6 w-6 text-primary" />
            AI Lesson Planner
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}</p>

        <div className="prose prose-gray max-w-none space-y-6">
          <Section title="1. Introduction">
            <p>AI Lesson Planner (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.</p>
          </Section>

          <Section title="2. Information We Collect">
            <p>We collect information you provide directly to us, including:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Account information: name, email address, password, and school affiliation</li>
              <li>Profile information: profile picture, role, and subject preferences</li>
              <li>Content you generate: lesson plans, schemes of work, assessments, and other teaching documents</li>
              <li>Communication data: messages sent through our AI chat assistant</li>
              <li>Payment information: processed securely through Stripe (we do not store card details)</li>
            </ul>
            <p>We also automatically collect certain technical information when you use our service, including your IP address, browser type, device information, and usage patterns.</p>
          </Section>

          <Section title="3. How We Use Your Information">
            <p>We use the collected information to:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Provide, maintain, and improve our AI lesson planning services</li>
              <li>Process your subscription payments</li>
              <li>Send you technical notices, updates, and support messages</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Monitor and analyze usage trends to improve user experience</li>
              <li>Detect, investigate, and prevent fraudulent transactions and abuse</li>
            </ul>
          </Section>

          <Section title="4. Data Storage and Security">
            <p>We implement appropriate technical and organizational security measures to protect your information. Your data is stored on secure servers with encryption at rest and in transit. We retain your information for as long as your account is active or as needed to provide you services.</p>
          </Section>

          <Section title="5. Data Sharing and Disclosure">
            <p>We do not sell your personal information. We may share your data with:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Service providers: Stripe (payment processing), OpenAI (AI content generation), Resend (email delivery), Cloudinary (file storage)</li>
              <li>School administrators: if you are part of a school account, your school administrator may have access to your usage data</li>
              <li>Legal requirements: when required by law or to protect our rights</li>
            </ul>
          </Section>

          <Section title="6. Your Rights">
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Access and update your personal information</li>
              <li>Export your generated content</li>
              <li>Delete your account and associated data</li>
              <li>Object to or restrict certain processing of your data</li>
              <li>Withdraw consent at any time where we rely on your consent to process information</li>
            </ul>
          </Section>

          <Section title="7. Cookies">
            <p>We use essential cookies for authentication and service functionality. We may also use analytics cookies to understand how you interact with our platform. You can control cookie preferences through your browser settings.</p>
          </Section>

          <Section title="8. Children&apos;s Privacy">
            <p>Our service is designed for use by teachers and educational professionals. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal data, please contact us.</p>
          </Section>

          <Section title="9. Changes to This Policy">
            <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.</p>
          </Section>

          <Section title="10. Contact Us">
            <p>If you have questions about this Privacy Policy, please contact us at:</p>
            <p className="text-muted-foreground">Email: privacy@ailessonplanner.com</p>
          </Section>
        </div>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} AI Lesson Planner. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="text-muted-foreground space-y-3 leading-relaxed">{children}</div>
    </section>
  )
}
