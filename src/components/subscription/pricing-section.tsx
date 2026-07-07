"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Check } from "lucide-react"
import { subscriptionPlans } from "@/config/site"
import type { SubscriptionPlan } from "@/config/site"

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <section id="pricing" className="container mx-auto px-4 py-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Choose the plan that fits your needs. No hidden fees. Cancel anytime.
        </p>
        <div className="flex items-center justify-center gap-3">
          <span className={cn("text-sm", !isYearly ? "font-medium" : "text-muted-foreground")}>
            Monthly
          </span>
          <Switch
            checked={isYearly}
            onCheckedChange={setIsYearly}
            aria-label="Toggle yearly billing"
          />
          <span className={cn("text-sm", isYearly ? "font-medium" : "text-muted-foreground")}>
            Yearly
            <span className="ml-1.5 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
              Save up to 20%
            </span>
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {subscriptionPlans.map((plan: SubscriptionPlan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            isYearly={isYearly}
          />
        ))}
      </div>
    </section>
  )
}

function PricingCard({ plan, isYearly }: { plan: SubscriptionPlan; isYearly: boolean }) {
  const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice
  const period = isYearly ? "/year" : "/month"
  const isFree = plan.id === "FREE"

  return (
    <Card
      className={cn(
        "relative flex flex-col border-2 transition-all duration-200",
        plan.popular
          ? "border-primary shadow-lg shadow-primary/10 scale-[1.02]"
          : "hover:border-primary/50",
        plan.highlighted && "border-dashed border-primary/60"
      )}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            Most Popular
          </span>
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-6">
        <div>
          <span className="text-4xl font-bold">
            {isFree ? "Free" : `KES ${(price * 130).toLocaleString()}`}
          </span>
          {!isFree && (
            <span className="text-muted-foreground ml-1">{period}</span>
          )}
          {!isFree && (
            <div className="text-xs text-muted-foreground mt-1">
              ~${price} USD
            </div>
          )}
        </div>
        <ul className="space-y-3">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-sm">
              <Check className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        {isFree ? (
          <Link href="/register" className="w-full">
            <Button variant="outline" className="w-full">
              Get Started Free
            </Button>
          </Link>
        ) : (
          <Link
            href={{
              pathname: "/register",
              query: { plan: plan.id, billing: isYearly ? "yearly" : "monthly" },
            }}
            className="w-full"
          >
            <Button
              className="w-full"
              variant={plan.popular ? "default" : "outline"}
            >
              {plan.highlighted ? "Contact Sales" : "Subscribe"}
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  )
}
