import { PartialMotionVariants } from "@/shared/interfaces";

export const fadeUpMotion = (delayAnimate: number, delayExit: number):PartialMotionVariants => {
    return {
        initial: { translateY: 100 },
        animate: {
            translateY: 0,                            
            transition: {
                type: "spring",
                stiffness: 50,
                damping: 10,
                mass: 0.5,
                delay: delayAnimate,
                duration: 0.5,
            }
        },
        exit: {
            opacity: 0,
            translateY: -100,
            transition: {
                type: "spring",
                stiffness: 50,
                damping: 10,
                mass: 0.5,
                delay: delayExit, 
                duration: 0.5,
            }
        }
    }
}
export const fadeUpSecondaryMotion = ():PartialMotionVariants => {
    return {
        initial:{ opacity: 0, y: 10 },
        animate:{ opacity: 1, y: 0 },
        exit:{ opacity: 0, y: -10 }
    }
}
