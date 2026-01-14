import { CardBody, CardWrapper } from "@/shared/components";
import { Punishment } from "../../interfaces";

import styles from './cardBan.module.css';
import { formatDate, getDaysBetweenDates } from "../../helpers";

type Props = {
    data: Punishment;
    variantStatus?: 'active' | 'inactive';
    isFadeUp?: boolean;
}

const CardBan = ({ data, isFadeUp = true, variantStatus = 'active' }:Props):JSX.Element => {
    console.log(data);

    return (
        <CardWrapper classNameParent={ styles.cardBan } isFadeUp={ isFadeUp }>
            <CardBody username={ data.nick ?? 'User eliminated' }>
                <span className={ `${styles.cardBan__status} ${variantStatus == 'active' ? styles.cardBan__status__active : styles.cardBan__status__inactive}` }>
                    { variantStatus === 'active' ? 'Activo' : 'Expirado' }
                </span>
            </CardBody>
            <div className={ styles.cardBan__content }>
                <div className={ styles.cardBan__item }>
                    <p>📝 Reason:</p>
                    <p>{ data.reason }</p>
                </div>
                {/* <div className={ styles.cardBan__item }>
                    <p>👮 Banned for:</p>
                    <p>{ data.nick }</p>
                </div> */}
                <div className={ styles.cardBan__item }>
                    <p>⏱️ Duration:</p>
                    <p>{ data.permanent ? 'Permanent' : `${getDaysBetweenDates(data.applied ?? '', data.expiration ?? '')} days` }</p>
                </div>
                <div className={ styles.cardBan__item }>
                    <p>📅 Date:</p>
                    <p>{ `${formatDate(data.applied)}` }</p>
                </div>
                <div className={ styles.cardBan__item }>
                    <p>⏰ When it expires:</p>
                    <p>{ data.permanent ? 'Never' : `${formatDate(data.expiration)}` }</p>
                </div>
            </div>
        </CardWrapper>
    )
}

export { CardBan }