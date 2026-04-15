import type { JSX } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { zoomInMotion } from '@/shared/motion';

import icon from '@/config/assets/svg/icon-spinner.svg';
import styles from './spinner.module.css';

type Props = {
    className?: string;
}

const Spinner = ({ className = '' }:Props):JSX.Element => {
    return (
        <motion.div 
            {...zoomInMotion(0,0)}
            className={ `${styles.spinner} ${className}` }
        >
            <Image src={ icon } alt="cargando" />
        </motion.div>
    )
}

export { Spinner }