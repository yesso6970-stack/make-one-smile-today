"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { ComponentProps } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends Omit<
  ComponentProps<typeof Link>,
  "className"
> {
  className?: string;
  size?: "default" | "sm" | "lg" | "xl";
}

export function AnimatedButton({
  className,
  size = "default",
  children,
  ...props
}: AnimatedButtonProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -1 }}
      transition={{ type: "spring", stiffness: 420, damping: 24 }}
    >
      <Link className={cn(buttonVariants({ size }), className)} {...props}>
        {children}
      </Link>
    </motion.div>
  );
}
