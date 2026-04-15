import type { JSX } from "react";
import styles from './cardWrapperSecondary.module.css';

type Props = {
    text?: string; 
}

const CardWrapperSecondaryChip = ({ text = '' }:Props):JSX.Element => {
    return (
        <div className={ styles.cardWrappersecondary__chip }>
            <p>{ text }</p>
        </div>
    )
}

export { CardWrapperSecondaryChip }