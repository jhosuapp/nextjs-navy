import { motion, MotionProps } from 'framer-motion';
import { forwardRef, TextareaHTMLAttributes, type JSX } from "react";

import styles from './textAreaField.module.css';
import { fadeInMotion } from '@/shared/motion/fadeIn.motion';

type NativeProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

type CustomProps = {
    feedback?: string;
    motionVariants?: any;
}

type Props = NativeProps & CustomProps & MotionProps;


const TextAreaField = forwardRef<HTMLTextAreaElement, Props>(({ feedback, motionVariants, ...props }, ref): JSX.Element => {
    return (
        <motion.div
            className={`global-field ${styles.textAreaField} ${feedback && 'global-error-field'}`}
            {...motionVariants}
        >
            <motion.textarea
                ref={ref}
                rows={4}
                {...props}
            />
            {/* Feedback */}
            {feedback && <motion.span className='field__error' {...fadeInMotion(0, 0)} role='alert'>{feedback}</motion.span>}
        </motion.div>
    );
}
);

TextAreaField.displayName = 'TextAreaField';

export { TextAreaField }
