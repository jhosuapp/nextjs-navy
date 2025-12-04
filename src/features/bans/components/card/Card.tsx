import { CardWrapper } from "@/features/home/components";
import styles from './card.module.css';
import { CardBody } from "@/shared/components";

type Props = {
    username: string;
    variantStatus?: 'active' | 'inactive'
}

const Card = ({ username, variantStatus = 'active' }:Props):JSX.Element => {
    return (
        <CardWrapper classNameParent={ styles.card }>
            <CardBody username={ username }>
                <span className={ `${styles.card__status} ${variantStatus == 'active' ? styles.card__status__active : styles.card__status__inactive}` }>
                    { variantStatus === 'active' ? 'Activo' : 'Expirado' }
                </span>
            </CardBody>
            <div className={ styles.card__content }>
                <div className={ styles.card__item }>
                    <p>📝 Razón:</p>
                    <p>Refuse ss</p>
                </div>
                <div className={ styles.card__item }>
                    <p>👮 Castigado por:</p>
                    <p>Jhosuapp</p>
                </div>
                <div className={ styles.card__item }>
                    <p>⏱️ Duración:</p>
                    <p>90d</p>
                </div>
                <div className={ styles.card__item }>
                    <p>📅 Fecha:</p>
                    <p>22 oct 2025, 20:25</p>
                </div>
                <div className={ styles.card__item }>
                    <p>⏰ Cuando expira:</p>
                    <p>20 ene 2026, 20:55</p>
                </div>
            </div>
        </CardWrapper>
    )
}

export { Card }