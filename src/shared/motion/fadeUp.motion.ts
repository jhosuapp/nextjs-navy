import { PartialMotionVariants } from "@/shared/interfaces/globals";

export const fadeUpMotion = (delayAnimate: number, delayExit: number):PartialMotionVariants => {
    return {
        initial: { translateY: 70 },
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
            translateY: -70,
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

export const fadeUpTertiaryMotion = (delayAnimate: number, delayExit: number, top: string):PartialMotionVariants => {
    return {
        initial:{ top: 0 },
        animate:{ 
            opacity: 1,
            top: top,
            transition: {
                duration: 5,
                type: "spring",
                stiffness: 10,
                damping: 20,
                delay:  delayAnimate
            }
        },
        exit: {
            opacity: 0,
            transition: {
                duration: 8,
                delay: delayExit
            },
        },
    }
}