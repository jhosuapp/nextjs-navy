import { HTMLAttributes, ReactNode, useState } from "react";
import { motion, MotionProps } from "framer-motion";
import styles from './container.module.css';

type NativeProps = HTMLAttributes<HTMLElement>;

type CustomProps = { 
    children: ReactNode;
    className?: string;
    isFirst?: boolean;
    isLast?: boolean;
}

type Props = NativeProps & CustomProps & MotionProps;

const Container = ({ children, className, isFirst = false, isLast = false, ...PropSection }:Props):JSX.Element => {
    const [isInView, setIsInView] = useState<boolean>(false);

    return (
        <motion.section 
            className={`${styles.container} ${isInView ? `${styles.animateContainer}` : ""} ${className ?? ""} ${isFirst && styles.containerFirst} ${isLast && styles.containerLast}`}
            onViewportEnter={() => setIsInView(true)} 
            onViewportLeave={() => setIsInView(false)}
            { ...PropSection } 
        >
            { children }
        </motion.section>
    )
}

export { Container }