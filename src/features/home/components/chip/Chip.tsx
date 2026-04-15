import type { JSX } from "react";
import styles from './chip.module.css';

type Props = {
    text: string;
}

const Chip = ({ text }:Props):JSX.Element => {
    return (
        <div className={ styles.chip }>
            <p>{ text }</p>
        </div>
    )
}

export { Chip }