import { PartialMotionVariants } from "@/shared/interfaces/globals";

/** Entrada lateral (drawers, menú off-canvas). `from` en % del propio ancho. */
export const slideInMotion = (from: "left" | "right" = "right"): PartialMotionVariants => {
    const offset = from === "right" ? "100%" : "-100%";
    return {
        initial: { x: offset },
        animate: {
            x: 0,
            transition: { type: "tween", ease: [0.22, 1, 0.36, 1], duration: 0.32 },
        },
        exit: {
            x: offset,
            transition: { type: "tween", ease: [0.4, 0, 1, 1], duration: 0.22 },
        },
    };
};

/** Entrada sutil para diálogos: escala + opacidad cortas. */
export const popInMotion = (): PartialMotionVariants => ({
    initial: { opacity: 0, scale: 0.96, y: 8 },
    animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { type: "tween", ease: [0.22, 1, 0.36, 1], duration: 0.22 },
    },
    exit: {
        opacity: 0,
        scale: 0.98,
        transition: { duration: 0.15 },
    },
});
