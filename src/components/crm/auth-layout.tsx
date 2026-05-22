import Link from "next/link";

export type AuthFooterVariant = "login" | "signup" | "forgot" | "reset";

const footerLinks: Record<AuthFooterVariant, { text: string; href: string; label: string }> = {
  login: { text: "Don't have an account?", href: "/signup", label: "Sign up" },
  signup: { text: "Already have an account?", href: "/login", label: "Log in" },
  forgot: { text: "Remember your password?", href: "/login", label: "Back to login" },
  reset: { text: "Remember your password?", href: "/login", label: "Back to login" }
};

export function AuthLayout({
  title,
  subtitle,
  children,
  footerVariant
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footerVariant?: AuthFooterVariant;
}) {
  const footer = footerVariant ? footerLinks[footerVariant] : null;

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between border-r border-white/[0.06] bg-[#111113] p-12 lg:flex">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-white text-xs font-bold text-black">P</span>
          <span className="text-sm font-medium text-white">Pipeline CRM</span>
        </Link>
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-white">Manage leads. Close deals.</h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/50">
            A modern CRM for teams that need pipeline visibility, follow-up discipline, and conversion analytics.
          </p>
        </div>
        <p className="text-xs text-white/30">Trusted by sales teams worldwide</p>
      </div>
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 flex items-center justify-center gap-2.5 lg:hidden">
            <span className="flex size-8 items-center justify-center rounded-lg bg-white text-xs font-bold text-black">P</span>
            <span className="text-sm font-medium text-white">Pipeline CRM</span>
          </Link>
          <div className="rounded-xl border border-white/[0.08] bg-[#111113] p-8">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-2 text-sm text-white/50">{subtitle}</p>
            <div className="mt-8">{children}</div>
            {footer ? (
              <p className="mt-6 text-center text-sm text-white/45">
                {footer.text}{" "}
                <Link href={footer.href} className="text-white hover:underline">
                  {footer.label}
                </Link>
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
