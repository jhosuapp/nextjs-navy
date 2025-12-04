import { ReactNode } from 'react';
import styles from './cardStaffWrapper.module.css';

type Props = {
    children: ReactNode;
}

const CardStaffWrapper = ({ children }:Props):JSX.Element => {
    return (
        <section className={ styles.cardStaffWrapper }>
            { children }
        </section>
    )
}

export { CardStaffWrapper }