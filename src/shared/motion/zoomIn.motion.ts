import { PartialMotionVariants } from "../interfaces";

export const zoomInMotion = (delayAnimate: number, delayExit: number): PartialMotionVariants => {
    return {
        initial: { scale: 0.5, opacity: 0, },
        animate: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 500,
                damping: 20,
                delay: delayAnimate,
            },
        },
        exit: {
            scale: 0.8,
            opacity: 0,
            pointerEvents: 'none',
            transition: {
                duration: 0.3,
                delay: delayExit
            },
        },
    };
};