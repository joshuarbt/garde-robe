"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ElementType, ReactNode } from "react";
import {
  fadeThrough,
  fadeUp,
  fadeUpAnimate,
  fadeUpInitial,
  motionTransition,
  staggerContainer,
  staggerDelay,
} from "@/lib/motion";

export { useReducedMotion as usePrefersReducedMotion };

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
      initial={reduced ? false : { opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={motionTransition(reduced, delay)}
    >
      {children}
    </motion.div>
  );
}

type CrossfadeProps = {
  children: ReactNode;
  contentKey: string;
  className?: string;
};

export function Crossfade({ children, contentKey, className }: CrossfadeProps) {
  const reduced = useReducedMotion() ?? false;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={contentKey}
        className={className}
        initial={reduced ? false : "hidden"}
        animate={reduced ? undefined : "visible"}
        exit={reduced ? undefined : "exit"}
        variants={reduced ? undefined : fadeThrough}
        transition={motionTransition(reduced)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
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
  index?: number;
};

export function StaggerItem({
  children,
  className,
  as = "div",
  index = 0,
}: StaggerItemProps) {
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
                transition: motionTransition(false, staggerDelay(index)),
              },
            }
      }
    >
      {children}
    </Component>
  );
}
