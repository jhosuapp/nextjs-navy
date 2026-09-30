import { memo, type JSX } from "react";
import { ITranslations } from "@/shared/interfaces/globals";
import { RankTrend } from "../../interfaces";

import styles from './trendBadge.module.css';

type Props = {
    trend: RankTrend;
    t: ITranslations;
}

const TrendBadge = memo(({ trend, t }: Props): JSX.Element | null => {
    if (trend.kind === "none") return null;

    if (trend.kind === "new") {
        return (
            <span className={ `${styles.trendBadge} ${styles.trendBadge__new}` } title={ t('trend.new') }>
                { t('trend.newShort') }
            </span>
        );
    }

    if (trend.kind === "same") {
        return (
            <span className={ `${styles.trendBadge} ${styles.trendBadge__same}` } title={ t('trend.same') } aria-label={ t('trend.same') }>
                <span aria-hidden="true">=</span>
            </span>
        );
    }

    const label = t(`trend.${trend.kind}`, { value: trend.delta });

    return (
        <span className={ `${styles.trendBadge} ${styles[`trendBadge__${trend.kind}`]}` } title={ label } aria-label={ label }>
            <span aria-hidden="true">{ trend.kind === "up" ? '▲' : '▼' } { trend.delta }</span>
        </span>
    );
});

TrendBadge.displayName = 'TrendBadge';

export { TrendBadge }
