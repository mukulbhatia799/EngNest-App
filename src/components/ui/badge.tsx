import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-neon-green/10 text-neon-green ring-neon-green/30",
        secondary:
          "bg-white/5 text-slate-300 ring-white/10",
        cyan:
          "bg-cyan-500/10 text-cyan-400 ring-cyan-500/30",
        purple:
          "bg-purple-500/10 text-purple-400 ring-purple-500/30",
        yellow:
          "bg-yellow-500/10 text-yellow-400 ring-yellow-500/30",
        red:
          "bg-red-500/10 text-red-400 ring-red-500/30",
        blue:
          "bg-blue-500/10 text-blue-400 ring-blue-500/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
