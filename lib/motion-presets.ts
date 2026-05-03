/** Shared motion tokens — springs tuned close to CALayer / physics-based UI defaults */
export const macSpringTransition = {
  type: 'spring' as const,
  stiffness: 420,
  damping: 34,
  mass: 0.85,
};

export const macSpringGentle = {
  type: 'spring' as const,
  stiffness: 280,
  damping: 28,
  mass: 1,
};

export function staggerReveal(delayChildren = 0.12, stagger = 0.055) {
  return {
    hidden: {},
    visible: {
      transition: { delayChildren, staggerChildren: stagger },
    },
  };
}

export function staggerItem(distance = 16) {
  return {
    hidden: { opacity: 0, y: distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: macSpringTransition,
    },
  };
}
