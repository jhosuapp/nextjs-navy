import { memo, type JSX } from "react";
import { CardBody, CardWrapper } from "@/shared/components";
import { Punishment } from "../../interfaces";
import { formatDate, getDaysBetweenDates } from "../../helpers";
import { ITranslations } from "@/shared/interfaces";

import styles from './cardBan.module.css';

type Props = {
    data: Punishment;
    t: ITranslations;
    variantStatus?: 'active' | 'inactive';
    isFadeUp?: boolean;
}

const CardBan = memo(({ data, t, isFadeUp = true, variantStatus = 'active' }:Props):JSX.Element => {

    return (
        <CardWrapper classNameParent={ styles.cardBan } isFadeUp={ isFadeUp }>
            <CardBody username={ data.nick ?? 'User eliminated' }>
                <span className={ `${styles.cardBan__status} ${variantStatus == 'active' ? styles.cardBan__status__active : styles.cardBan__status__inactive}` }>
                    { variantStatus === 'active' ? t('card.active') : t('card.expired') }
                </span>
            </CardBody>
            <div className={ styles.cardBan__content }>
                <div className={ styles.cardBan__item }>
                    <p>📝 {t('card.reason')}:</p>
                    <p>{ data.reason }</p>
                </div>
                <div className={ styles.cardBan__item }>
                    <p>👮 {t('card.bannedFor')}:</p>
                    <p>{ data.nick }</p>
                </div>
                <div className={ styles.cardBan__item }>
                    <p>⏱️ {t('card.duration')}:</p>
                    <p>{ data.permanent ? t('card.permanent') : `${getDaysBetweenDates(data.applied ?? '', data.expiration ?? '')} ${t('card.days')}` }</p>
                </div>
                <div className={ styles.cardBan__item }>
                    <p>📅 {t('card.date')}:</p>
                    <p>{ `${formatDate(data.applied)}` }</p>
                </div>
                <div className={ styles.cardBan__item }>
                    <p>⏰ {t('card.whenExpires')}:</p>
                    <p>{ data.permanent ? t('card.never') : `${formatDate(data.expiration ?? '')}` }</p>
                </div>
            </div>
        </CardWrapper>
    )
})

export { CardBan }