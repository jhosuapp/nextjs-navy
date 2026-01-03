import Image from 'next/image';
import { ButtonHTMLAttributes } from 'react';
import { motion, MotionProps } from 'framer-motion';

import iconDefault from '@/config/assets/svg/icon-arrow.svg';
import iconLoader from '@/config/assets/svg/icon-spinner.svg';
import styles from './button.module.css';

type NativeProps = ButtonHTMLAttributes<HTMLButtonElement>;

type CustomProps = {
    text?: string;
    style?: 'primary' | 'secondary' | 'fit';
    isLight?: boolean;
    className?: string;
    icon?: string;
    iconRight?: string;
    isLoad?: boolean;
} & MotionProps;

type Props = CustomProps & NativeProps;

const Button = ({ text, style, isLight, className, icon, iconRight, isLoad = false, ...props }:Props):JSX.Element => {
    return (
        <motion.button 
            className={ `${styles.button} ${styles[`button--${style}`]} ${className ?? ''} ${isLoad && styles.button__loader}` }
            whileTap={{ scale: 0.95 }} 
            whileHover={{ scale: 1.05 }}
            {...props}
        >
            <Image 
                className={ styles.button__icon }
                src={ icon ? icon : iconDefault } 
                alt="icono Navy"
            />
            <span>{ text }</span>
            {isLoad ? (
                <Image 
                    className={ styles.button__iconLoader }
                    src={ iconLoader } 
                    alt="icono loader Navy"
                />
            ) : (
                <>
                    {iconRight ? (
                        <Image 
                            className={ styles.button__iconSecondary }
                            src={ iconRight } 
                            alt="icono Navy"
                        />
                    ) : (
                        <b></b>
                    )}
                </>
            )}
        </motion.button>
    )
}

export { Button }