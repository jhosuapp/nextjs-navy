import { PartialMotionVariants } from "../interfaces";

export const flowerMotion = (delayAnimate: number, delayExit: number): PartialMotionVariants => {
    return {
        initial: { scale: 0.5, opacity: 0, rotate: 0.5 },
        animate: {
            scale: 1,
            opacity: 1,
            rotate: 0,
            transition: {
                type: "spring",
                stiffness: 100, 
                damping: 15,    
                delay: delayAnimate,
            },
        },
        exit: {
            scale: 0.8,
            opacity: 0,
            transition: {
                duration: 0.3,
                delay: delayExit
            },
        },
    };
};