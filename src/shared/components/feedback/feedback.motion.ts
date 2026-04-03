import { Variants } from "framer-motion";

export const containerVariants:Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            when: "beforeChildren",
            staggerChildren: 0.3
        }
    }
};

export const pathVariants:Variants = {
    hidden: {
        pathLength: 0,
        fill: "rgba(255, 255, 255, 0)"
    },
    visible: {
        pathLength: 1,
        fill: "rgba(216, 180, 254, 0.5)",
        transition: {
            pathLength: { 
                type: "spring", 
                duration: 3.5, 
                bounce: 0.2
            },
            fill: { 
                delay: 1, 
                duration: .25
            }
        }
    }
};