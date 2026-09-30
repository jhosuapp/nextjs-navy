import { memo, type JSX } from "react";
import { motion } from "framer-motion";
import { fadeInMotion } from "@/shared/motion/fadeIn.motion";
import { ITranslations } from "@/shared/interfaces/globals";
import { skinName } from "../../helpers";
import { RankedTester } from "../../interfaces";
import { RoleChip } from "../role-chip/RoleChip";
import { TrendBadge } from "../trend-badge/TrendBadge";

import styles from './rankingList.module.css';

type Props = {
    tester: RankedTester;
    index: number;
    locale: string;
    t: ITranslations;
    onOpen: (nick: string | null) => void;
}

const RankingRow = memo(({ tester, index, locale, t, onOpen }: Props): JSX.Element => {
    const name = tester.nick ?? t('retired');
    const tests = new Intl.NumberFormat(locale).format(tester.tests);
    const delay = (index % 20) * 0.03;
    const isTop3 = tester.position <= 3;

    return (
        <motion.li layout className={ styles.rankingRow } {...fadeInMotion(delay, 0)}>
            <div
                className={ `${styles.rankingRow__position} ${isTop3 ? styles[`rankingRow__position${tester.position}`] : ''}` }
                aria-label={ t('list.position', { value: tester.position }) }
            >
                <span>{ tester.position }</span>
            </div>
            <div className={ styles.rankingRow__identity }>
                <div className={ styles.rankingRow__skin }>
                    <img src={ `https://render.crafty.gg/3d/bust/${skinName(tester.nick)}` } alt="" loading="lazy" />
                </div>
                <div className={ styles.rankingRow__name }>
                    <p className={ !tester.nick ? styles.rankingRow__retired : '' } title={ name }>{ name }</p>
                    {tester.role_name && <RoleChip name={ tester.role_name } colour={ tester.role_colour } />}
                </div>
            </div>
            <div className={ styles.rankingRow__bar } aria-hidden="true">
                <span style={{ width: `${Math.max(tester.relative, 2)}%` }} />
            </div>
            <div className={ styles.rankingRow__stats }>
                <TrendBadge trend={ tester.trend } t={ t } />
                <p>
                    <strong>{ tests }</strong>
                    <span>{ t('list.tests') }</span>
                </p>
            </div>
            {tester.nick && (
                <button type="button" className={ styles.rankingRow__hit } onClick={ () => onOpen(tester.nick) } aria-label={ name } />
            )}
        </motion.li>
    );
});

RankingRow.displayName = 'RankingRow';

export { RankingRow }
