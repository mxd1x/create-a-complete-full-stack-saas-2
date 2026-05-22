import Link from "next/link";
import { ArrowRight, BarChart3, Building2, Check, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Users,
    title: "Lead management",
    text: "Capture, assign, and track every prospect with priority and follow-up dates."
  },
  {
    icon: Building2,
    title: "Company accounts",
    text: "Organize leads by company and keep your pipeline structured."
  },
  {
    icon: BarChart3,
    title: "Pipeline analytics",
    text: "Monitor conversions, won deals, and team performance in one view."
  }
];

const plans = [
  { name: "Starter", price: 49, leads: "500 leads" },
  { name: "Pro", price: 99, leads: "Unlimited leads", featured: true },
  { name: "Enterprise", price: 249, leads: "SSO + API" }
];

export function CrmLanding() {
  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-white text-xs font-bold text-black">P</span>
          <span className="text-sm font-medium">Pipeline CRM</span>
        </Link>
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/signup">Start free trial</Link>
          </Button>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 pb-24 pt-16 md:pt-24">
        <p className="text-xs font-medium uppercase tracking-widest text-white/40">Modern sales CRM</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
          Manage leads.
          <br />
          Close deals.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-white/50">
          Pipeline CRM helps your team track prospects, move deals through stages, and measure what converts.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button asChild size="lg">
            <Link href="/signup">
              Start free trial
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">View demo login</Link>
          </Button>
        </div>
        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Teams onboarded", value: "2,400+" },
            { label: "Deals tracked", value: "1.2M+" },
            { label: "Avg. conversion lift", value: "28%" }
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-white/[0.06] bg-[#111113] p-5">
              <p className="text-2xl font-semibold">{s.value}</p>
              <p className="mt-1 text-sm text-white/45">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-white/[0.06] bg-[#111113]/50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-semibold tracking-tight">Built for sales teams</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border border-white/[0.06] bg-[#09090b] p-6">
                <f.icon className="h-5 w-5 text-white/50" />
                <h3 className="mt-4 font-medium">{f.title}</h3>
                <p className="mt-2 text-sm text-white/45">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-semibold tracking-tight">Simple pricing</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl border p-6 ${plan.featured ? "border-white/20 bg-[#111113]" : "border-white/[0.06] bg-[#111113]/50"}`}
              >
                <p className="text-sm text-white/45">{plan.name}</p>
                <p className="mt-2 text-3xl font-semibold">${plan.price}<span className="text-sm font-normal text-white/40">/mo</span></p>
                <p className="mt-2 text-sm text-white/50">{plan.leads}</p>
                <Button asChild className="mt-6 w-full" variant={plan.featured ? "default" : "outline"}>
                  <Link href="/signup">Get started</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.06] py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-white/40 sm:flex-row">
          <span>© {new Date().getFullYear()} Pipeline CRM</span>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            <span>Production-ready · Auth · PostgreSQL · Docker</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
