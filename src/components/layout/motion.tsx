"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ElementType, ReactNode } from "react";
import {
  fadeUp,
  fadeUpAnimate,
  fadeUpInitial,
  motionTransition,
  staggerContainer,
} from "@/lib/motion";

type FadeInProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  const reduced = useReducedMotion() ?? false;

  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={motionTransition(reduced, delay)}
    >
      {children}
    </motion.div>
  );
}

type StaggerListProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul";
};

export function StaggerList({ children, className, as = "div" }: StaggerListProps) {
  const reduced = useReducedMotion() ?? false;
  const Component = motion[as] as ElementType;

  return (
    <Component
      className={className}
      initial={fadeUpInitial(reduced)}
      animate={fadeUpAnimate(reduced)}
      variants={reduced ? undefined : staggerContainer}
    >
      {children}
    </Component>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "li";
};

export function StaggerItem({ children, className, as = "div" }: StaggerItemProps) {
  const reduced = useReducedMotion() ?? false;
  const Component = motion[as] as ElementType;

  return (
    <Component
      className={className}
      variants={
        reduced
          ? undefined
          : {
              hidden: fadeUp.hidden,
              visible: {
                ...fadeUp.visible,
                transition: motionTransition(false),
              },
            }
      }
    >
      {children}
    </Component>
  );
}
