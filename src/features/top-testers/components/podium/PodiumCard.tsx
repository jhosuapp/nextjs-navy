import { memo, type JSX } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ITranslations } from "@/shared/interfaces/globals";
import { skinName } from "../../helpers";
import { RankedTester } from "../../interfaces";
import { RoleChip } from "../role-chip/RoleChip";
import { TrendBadge } from "../trend-badge/TrendBadge";

import styles from './podium.module.css';
import iconCrown from '@/config/assets/svg/icon-crown.svg';

export type PodiumPlace = 1 | 2 | 3;

type Props = {
    tester: RankedTester;
    place: PodiumPlace;
    locale: string;
    t: ITranslations;
    onOpen: (nick: string | null) => void;
}

/** Retraso de entrada: primero el #3, luego el #2 y al final el #1. */
const ENTER_DELAY: Record<PodiumPlace, number> = { 1: 0.55, 2: 0.4, 3: 0.25 };

const PodiumCard = memo(({ tester, place, locale, t, onOpen }: Props): JSX.Element => {
    const reduceMotion = useReducedMotion();
    const name = tester.nick ?? t('retired');
    const format = new Intl.NumberFormat(locale);
    const share = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(tester.share);

    return (
        <motion.li
            className={ `${styles.podiumCard} ${styles[`podiumCard__place${place}`]}` }
            initial={ reduceMotion ? false : { opacity: 0, y: 40 } }
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 70, damping: 14, delay: reduceMotion ? 0 : ENTER_DELAY[place] }}
            aria-label={ t('list.position', { value: tester.position }) }
        >
            <div className={ styles.podiumCard__card }>
                {place === 1 && <span className={ styles.podiumCard__glow } aria-hidden="true" />}
                <div className={ styles.podiumCard__medal } aria-hidden="true">
                    {place === 1 && (
                        <Image className={ styles.podiumCard__crown } src={ iconCrown } alt="" width={28} height={28} />
                    )}
                    <span>{ tester.position }</span>
                </div>
                <div className={ styles.podiumCard__skin }>
                    <img
                        src={ `https://render.crafty.gg/3d/bust/${skinName(tester.nick)}` }
                        alt={ name }
                        loading="lazy"
                    />
                </div>
                <div className={ styles.podiumCard__identity }>
                    <p className={ `${styles.podiumCard__nick} ${!tester.nick ? styles.podiumCard__nick__retired : ''}` } title={ name }>
                        { name }
                    </p>
                    {tester.role_name && <RoleChip name={ tester.role_name } colour={ tester.role_colour } />}
                </div>
                <p className={ styles.podiumCard__tests }>
                    <strong>{ format.format(tester.tests) }</strong>
                    <span>{ t('podium.tests') }</span>
                </p>
                <div className={ styles.podiumCard__meta }>
                    <span>{ t('podium.share', { value: share }) }</span>
                    <TrendBadge trend={ tester.trend } t={ t } />
                </div>
                {tester.nick && (
                    <button
                        type="button"
                        className={ styles.podiumCard__hit }
                        onClick={ () => onOpen(tester.nick) }
                        aria-label={ name }
                    />
                )}
            </div>
            <div className={ styles.podiumCard__step } aria-hidden="true">
                <span>{ tester.position }</span>
            </div>
        </motion.li>
    );
});

PodiumCard.displayName = 'PodiumCard';

export { PodiumCard }
