import { motion, MotionProps } from 'framer-motion';
import { forwardRef, InputHTMLAttributes } from "react";

import styles from './inputField.module.css';
import { fadeInMotion } from '@/shared/motion';

type NativeProps = InputHTMLAttributes<HTMLInputElement>;

type CustomProps = {
    feedback?: string;
    motionVariants?: any;
}

type Props = NativeProps & CustomProps & MotionProps;


const InputField = forwardRef<HTMLInputElement, Props>(({ feedback, style, motionVariants, ...props }, ref) => {
        return (
            <motion.div 
                className={ `global-field ${styles.inputField} ${feedback && 'global-error-field'}` }
                {...motionVariants} 
            >                
                <motion.input 
                    ref={ref}
                    {...props}
                />
                {/* Feedback */}
                {feedback && <motion.span {...fadeInMotion(0,0)} role='alert'>{ feedback }</motion.span>}
            </motion.div>
        );
    }
);

export { InputField }