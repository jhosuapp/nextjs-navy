import { ReactNode, useRef, type JSX } from "react";
import { motion, useScroll, useTransform } from "framer-motion"
import styles from "./wrapperCarousel.module.css"

type Props = {
    children: ReactNode;
    reverse?: boolean;
}

const WrapperCarousel = ({ children, reverse = false }: Props): JSX.Element => {
    const ref = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const distance = 400
    const x = useTransform(
        scrollYProgress,
        [0, 1],
        reverse ? [-distance, 0] : [0, -distance]
    )

    return (
        <div ref={ref} className={styles.carousel}>
            <motion.div
                className={styles.carousel__track}
                style={{ x }}
            >
                {children}
            </motion.div>
        </div>
    )
}

export { WrapperCarousel }
