import { CardBody, CardWrapper } from "@/shared/components";

import styles from './cardBan.module.css';

type Props = {
    username: string;
    variantStatus?: 'active' | 'inactive'
}

const CardBan = ({ username, variantStatus = 'active' }:Props):JSX.Element => {
    return (
        <CardWrapper classNameParent={ styles.cardBan }>
            <CardBody username={ username }>
                <span className={ `${styles.cardBan__status} ${variantStatus == 'active' ? styles.cardBan__status__active : styles.cardBan__status__inactive}` }>
                    { variantStatus === 'active' ? 'Activo' : 'Expirado' }
                </span>
            </CardBody>
            <div className={ styles.cardBan__content }>
                <div className={ styles.cardBan__item }>
                    <p>📝 Razón:</p>
                    <p>Refuse ss</p>
                </div>
                <div className={ styles.cardBan__item }>
                    <p>👮 Castigado por:</p>
                    <p>Jhosuapp</p>
                </div>
                <div className={ styles.cardBan__item }>
                    <p>⏱️ Duración:</p>
                    <p>90d</p>
                </div>
                <div className={ styles.cardBan__item }>
                    <p>📅 Fecha:</p>
                    <p>22 oct 2025, 20:25</p>
                </div>
                <div className={ styles.cardBan__item }>
                    <p>⏰ Cuando expira:</p>
                    <p>20 ene 2026, 20:55</p>
                </div>
            </div>
        </CardWrapper>
    )
}

export { CardBan }