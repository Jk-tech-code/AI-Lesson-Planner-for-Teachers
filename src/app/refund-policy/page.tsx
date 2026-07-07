import Link from "next/link"
import { Sparkles } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "AI Lesson Planner refund policy - details on cancellations and refunds.",
}

export default function RefundPolicyPage() {
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
        <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}</p>

        <div className="space-y-6">
          <Section title="1. Free Trial">
            <p>New users can try AI Lesson Planner with a 14-day free trial of the Free tier. During this period, you can explore the Platform&apos;s features without any payment obligation. No credit card is required to sign up for the free tier.</p>
          </Section>

          <Section title="2. Subscription Cancellation">
            <p>You can cancel your subscription at any time from your account settings page. Upon cancellation:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>You will retain access to paid features until the end of your current billing period</li>
              <li>Your account will be downgraded to the Free tier after the billing period ends</li>
              <li>You will not be charged for the next billing cycle</li>
            </ul>
          </Section>

          <Section title="3. Refund Eligibility">
            <p>We offer refunds under the following conditions:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Annual subscriptions:</strong> Full refund within 14 days of purchase, minus any usage period</li>
              <li><strong>Monthly subscriptions:</strong> Refunds are issued on a case-by-case basis for technical issues preventing service usage</li>
              <li><strong>School/Enterprise plans:</strong> Refund terms are specified in your service agreement</li>
            </ul>
          </Section>

          <Section title="4. How to Request a Refund">
            <p>To request a refund, please contact our support team at support@ailessonplanner.com with:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>The email address associated with your account</li>
              <li>Your subscription plan name</li>
              <li>The reason for your refund request</li>
              <li>Any relevant details (technical issues, etc.)</li>
            </ul>
            <p>We will process your request within 5-7 business days.</p>
          </Section>

          <Section title="5. Payment Disputes">
            <p>If you notice an unauthorized charge or billing error, please contact us immediately. We will investigate and resolve the issue promptly. We encourage you to contact us before filing a chargeback with your bank, as we are committed to resolving any concerns.</p>
          </Section>

          <Section title="6. Service Downgrades">
            <p>If you experience extended service downtime due to our infrastructure (excluding scheduled maintenance), you may be eligible for a service credit equivalent to the downtime period. Please report any extended outages to our support team.</p>
          </Section>

          <Section title="7. M-Pesa Payments">
            <p>For payments made via M-Pesa, refunds will be processed back to the same mobile money account used for the original transaction. Processing time may take 3-5 business days depending on your mobile network provider.</p>
          </Section>

          <Section title="8. Contact">
            <p>For billing inquiries and refund requests:</p>
            <p className="text-muted-foreground">Email: support@ailessonplanner.com</p>
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
