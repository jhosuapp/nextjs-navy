const TIERS_CONFIG = [
    { key: "t1", tier: 1, variant: "primary", delay: { enter: 0, exit: 0.6 } },
    { key: "t2", tier: 2, variant: "secondary", delay: { enter: 0.1, exit: 0.5 } },
    { key: "t3", tier: 3, variant: "tertiary", delay: { enter: 0.2, exit: 0.4 } },
    { key: "t4", tier: 4, variant: "fourth", delay: { enter: 0.3, exit: 0.3 } },
    { key: "t5", tier: 5, variant: "fifth", delay: { enter: 0.4, exit: 0.2 } },
] as const

export { TIERS_CONFIG }