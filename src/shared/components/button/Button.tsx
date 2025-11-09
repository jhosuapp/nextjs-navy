import styles from './button.module.css';
import iconDefault from '@/config/assets/svg/icon-arrow.svg';
import Image from 'next/image';
import { ButtonHTMLAttributes } from 'react';

type NativeProps = ButtonHTMLAttributes<HTMLButtonElement>;

type CustomProps = {
    text?: string;
    style?: 'primary' | 'secondary';
    isLight?: boolean;
    className?: string;
    icon?: string;
    iconRight?: string;
}

type Props = CustomProps & NativeProps;

const Button = ({ text, style, isLight, className, icon, iconRight, ...props }:Props):JSX.Element => {
    return (
        <button 
            className={ `${styles.button} ${styles[`button--${style}`]} ${className ?? ''}` }
            {...props}
        >
            <Image 
                className={ styles.button__icon }
                src={ icon ? icon : iconDefault } 
                alt="icono Navy"
            />
            <span>{ text }</span>
            {iconRight ? (
                <Image 
                    className={ styles.button__iconSecondary }
                    src={ iconRight } 
                    alt="icono Navy"
                />
            ) : (
                <b></b>
            )}
        </button>
    )
}

export { Button }