import type { JSX } from "react";
import { motion } from 'framer-motion';
import { CardWrapperSecondaryChip } from "../card-wrapper-secondary/CardWrapperSecondaryChip";
import { fadeInMotion } from '@/shared/motion';
import styles from './notFound.module.css';


type Props = {
    description: string;
    text: string;
}

const NotFound = ({ description, text }:Props):JSX.Element => {
    return (
        <motion.div className={ styles.notFound } {...fadeInMotion(0,0)}>
            <p className={ styles.notFoundText }>{ description }</p>
            <CardWrapperSecondaryChip text={ text } />
        </motion.div>
    )
}

export { NotFound }