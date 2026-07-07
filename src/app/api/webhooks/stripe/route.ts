import { NextRequest } from "next/server"
import Stripe from "stripe"
import { prisma } from "@/lib/prisma"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.cholla" as any,
})

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return new Response("Webhook signature verification failed", { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const tier = session.metadata?.tier

        if (userId && tier) {
          await prisma.subscription.upsert({
            where: { userId },
            update: {
              tier: tier as any,
              status: "ACTIVE",
              provider: "STRIPE",
              currentPeriodStart: new Date(),
              currentPeriodEnd: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
              ),
            },
            create: {
              userId,
              tier: tier as any,
              status: "ACTIVE",
              provider: "STRIPE",
              currentPeriodStart: new Date(),
              currentPeriodEnd: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
              ),
            },
          })

          await prisma.invoice.create({
            data: {
              subscriptionId: userId,
              amount: session.amount_total! / 100,
              currency: session.currency!.toUpperCase(),
              status: "paid",
              provider: "STRIPE",
              providerInvoiceId: session.id,
              paidAt: new Date(),
            },
          })
        }
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        if (userId) {
          await prisma.subscription.update({
            where: { userId },
            data: {
              status: "CANCELLED",
              cancelledAt: new Date(),
            },
          })
        }
        break
      }
    }

    return new Response("Webhook received", { status: 200 })
  } catch (error) {
    console.error("Webhook error:", error)
    return new Response("Webhook handler failed", { status: 500 })
  }
}
