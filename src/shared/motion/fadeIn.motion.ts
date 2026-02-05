import { PartialMotionVariants } from "@/shared/interfaces";
import { easeIn } from "framer-motion";

export const fadeInMotion = (delayAnimate?: number, delayExit?: number):PartialMotionVariants => {
    return {
        initial:{ opacity: 0 },
        animate:{ 
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: easeIn,
                delay: delayAnimate ?? 0
            }
        },
        exit:{ 
            opacity: 0,
            transition: {
                delay: delayExit ?? 0
            }
        },
    }
}

export const fadeInNoneMotion = (delayAnimate?: number, delayExit?: number):PartialMotionVariants => {
    return {
        initial:{ opacity: 0, display: 'none' },
        animate:{ 
            opacity: 1,
            display: 'flex',
            transition: {
                duration: 0.5,
                ease: easeIn,
                delay: delayAnimate ?? 0
            }
        },
        exit:{ 
            opacity: 0,
            display: 'none',
            transition: {
                delay: delayExit ?? 0
            }
        },
    }
}