import type { Transition, Variants } from "framer-motion";

export const MOTION_EASE = [0.22, 1, 0.36, 1] as const;
export const MOTION_DURATION = 0.35;
export const MOTION_DURATION_FAST = 0.2;
export const MOTION_STAGGER = 0.06;
export const MOTION_STAGGER_CAP = 12;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 4 },
  visible: { opacity: 1, y: 0 },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: MOTION_STAGGER },
  },
};

export const modalBackdrop: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const modalPanel: Variants = {
  hidden: { opacity: 0, scale: 0.98, y: 8 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

export const sheetBackdrop: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const sheetPanelMobile: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export const sheetPanelDesktop: Variants = {
  hidden: { opacity: 0, scale: 0.98, y: 8 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

export const fadeThrough: Variants = {
  hidden: { opacity: 0, y: 4 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
};

export const popover: Variants = {
  hidden: { opacity: 0, scale: 0.98, y: -4 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.98, y: -4 },
};

export function motionTransition(reduced: boolean, delay = 0): Transition {
  if (reduced) {
    return { duration: 0, delay: 0 };
  }

  return {
    duration: MOTION_DURATION,
    ease: MOTION_EASE,
    delay,
  };
}

export function motionTransitionFast(reduced: boolean, delay = 0): Transition {
  if (reduced) {
    return { duration: 0, delay: 0 };
  }

  return {
    duration: MOTION_DURATION_FAST,
    ease: MOTION_EASE,
    delay,
  };
}

export function staggerDelay(index: number): number {
  if (index >= MOTION_STAGGER_CAP) {
    return 0;
  }

  return index * MOTION_STAGGER;
}

export function fadeUpInitial(reduced: boolean) {
  return reduced ? false : "hidden";
}

export function fadeUpAnimate(reduced: boolean) {
  return reduced ? undefined : "visible";
}

export function revealProps(reduced: boolean, delay = 0) {
  if (reduced) {
    return {
      initial: false as const,
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0 },
    };
  }

  return {
    initial: { opacity: 0, y: 4 },
    animate: { opacity: 1, y: 0 },
    transition: motionTransition(false, delay),
  };
}

export function modalMotionProps(reduced: boolean) {
  if (reduced) {
    return {
      backdrop: {
        initial: false as const,
        animate: { opacity: 1 },
        transition: { duration: 0 },
      },
      panel: {
        initial: false as const,
        animate: { opacity: 1, scale: 1, y: 0 },
        transition: { duration: 0 },
      },
    };
  }

  return {
    backdrop: {
      initial: "hidden" as const,
      animate: "visible" as const,
      variants: modalBackdrop,
      transition: motionTransition(false),
    },
    panel: {
      initial: "hidden" as const,
      animate: "visible" as const,
      variants: modalPanel,
      transition: motionTransition(false),
    },
  };
}

export function sheetMotionProps(reduced: boolean, isDesktop: boolean) {
  const panelVariants = isDesktop ? sheetPanelDesktop : sheetPanelMobile;

  if (reduced) {
    return {
      backdrop: {
        initial: false as const,
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0 },
      },
      panel: {
        initial: false as const,
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0 },
        transition: { duration: 0 },
      },
    };
  }

  return {
    backdrop: {
      initial: "hidden" as const,
      animate: "visible" as const,
      exit: "hidden" as const,
      variants: sheetBackdrop,
      transition: motionTransition(false),
    },
    panel: {
      initial: "hidden" as const,
      animate: "visible" as const,
      exit: "hidden" as const,
      variants: panelVariants,
      transition: motionTransition(false),
    },
  };
}

export function popoverMotionProps(reduced: boolean) {
  if (reduced) {
    return {
      initial: false as const,
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0 },
      transition: { duration: 0 },
    };
  }

  return {
    initial: "hidden" as const,
    animate: "visible" as const,
    exit: "exit" as const,
    variants: popover,
    transition: motionTransitionFast(false),
  };
}
