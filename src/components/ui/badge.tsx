import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors duration-300", {
  variants: {
    variant: {
      default: "border-white/[0.08] bg-white/[0.04] text-white/60",
      warm: "border-amber-500/20 bg-amber-500/10 text-amber-200/90",
      cold: "border-sky-500/20 bg-sky-500/10 text-sky-200/90",
      hot: "border-orange-500/20 bg-orange-500/10 text-orange-200/90",
      outline: "border-white/[0.08] bg-transparent text-white/50"
    }
  },
  defaultVariants: { variant: "default" }
});

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
