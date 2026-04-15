import { HTMLAttributes, ReactNode, type JSX } from "react";
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

    return (
        <motion.section 
            className={`${styles.container} ${className ?? ""} ${isFirst && styles.containerFirst} ${isLast && styles.containerLast}`}

            { ...PropSection } 
        >
            { children }
        </motion.section>
    )
}

export { Container }