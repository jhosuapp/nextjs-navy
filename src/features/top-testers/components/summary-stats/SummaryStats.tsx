import { memo, type JSX } from "react";
import { motion } from "framer-motion";
import { fadeUpMotion } from "@/shared/motion/fadeUp.motion";
import { ITranslations } from "@/shared/interfaces/globals";
import { TopTestersSummary } from "../../interfaces";

import styles from './summaryStats.module.css';

type Props = {
    summary: TopTestersSummary;
    locale: string;
    t: ITranslations;
}

const SummaryStats = memo(({ summary, locale, t }: Props): JSX.Element => {
    const format = new Intl.NumberFormat(locale);
    const items = [
        { key: 'tests', value: summary.totalTests },
        { key: 'testers', value: summary.activeTesters },
        { key: 'average', value: summary.average },
    ];

    return (
        <dl className={ styles.summaryStats }>
            {items.map((item, index) => (
                <motion.div className={ styles.summaryStats__item } key={ item.key } {...fadeUpMotion(0.2 + index * 0.08, 0)}>
                    <dt>{ t(`summary.${item.key}`) }</dt>
                    <dd>{ format.format(item.value) }</dd>
                </motion.div>
            ))}
        </dl>
    );
});

SummaryStats.displayName = 'SummaryStats';

export { SummaryStats }
