import { InputHTMLAttributes, ReactNode, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import styles from './radioField.module.css';

type NativeProps = InputHTMLAttributes<HTMLInputElement>;

type CustomProps = {
    children?: ReactNode;
    classNameParent?: string;
    classNameWrapper?: string;
    motionVariants?: any;
}

type Props = NativeProps & CustomProps;


const RadioField = ({ children, style, classNameParent = '', classNameWrapper = '', motionVariants, ...props }:Props) => {
    const [isChecked, setIsChecked] = useState<boolean>(false);

    useEffect(() => {
        setIsChecked(!!props.checked);
    }, [props.checked]);

    return (
        <motion.div 
            className={ `${styles.radioField} ${isChecked ? styles.radioField__checked : ''} ${classNameWrapper}` }
            {...motionVariants}
        >
            <motion.div 
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.01 }}
                className={ `${styles.radioFieldContent} ${classNameParent}` }
            >
                <input 
                    type="radio"
                    onChange={(e) => {
                        setIsChecked(e.target.checked);
                        props.onChange?.(e);
                      }}
                    {...props}
                />
                <label
                    htmlFor={ props.id }   
                >
                    { children }
                </label>
            </motion.div>
        </motion.div>
    )
}

export { RadioField }