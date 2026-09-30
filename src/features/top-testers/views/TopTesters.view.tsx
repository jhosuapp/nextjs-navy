import type { JSX } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/shared/components/container/Container";
import { fadeInMotion } from "@/shared/motion/fadeIn.motion";
import { fadeUpMotion } from "@/shared/motion/fadeUp.motion";
import { PeriodFilters, Podium, RankingList, SummaryStats } from "../components";
import { useTopTestersController } from "../hooks";
import { TopTestersData } from "../interfaces";

import styles from './topTesters.module.css';

type Props = {
    data: TopTestersData;
}

const TopTestersView = ({ data }: Props): JSX.Element => {
    const controller = useTopTestersController(data);
    const { t, period, periodLabel, podium, list, hasMore, totalResults, isEmptyPeriod, isFiltering, summary, locale, onOpenTester, onShowMore, isCurrentMonth, updatedLabel } = controller;

    return (
        <Container className="!mt-5 lg:!mt-10" isFirst isLast {...fadeUpMotion(0.7, 0.13)}>
            <header className={ styles.topTesters__header }>
                <div>
                    <p className={ styles.topTesters__eyebrow }>{ periodLabel }</p>
                    <h1 className={ styles.topTesters__title }>{ t('title') }</h1>
                    <p className={ styles.topTesters__subtitle }>{ t('subtitle') }</p>
                </div>
                <SummaryStats summary={ summary } locale={ locale } t={ t } />
            </header>

            <div className={ styles.topTesters__filters }>
                <PeriodFilters {...controller} />
            </div>

            {/* `key` = periodo: al cambiarlo, podio y lista vuelven a animar su entrada. */}
            <AnimatePresence mode="wait">
                <motion.div key={ period } {...fadeInMotion(0, 0)}>
                    {isEmptyPeriod ? (
                        <div className={ styles.topTesters__empty } role="status">
                            <p>{ t('empty.title') }</p>
                            <span>{ t('empty.period') }</span>
                        </div>
                    ) : (
                        <>
                            {!isFiltering && podium.length > 0 && (
                                <Podium testers={ podium } locale={ locale } t={ t } onOpen={ onOpenTester } />
                            )}

                            <section className={ styles.topTesters__list } aria-label={ t('list.title') }>
                                <div className={ styles.topTesters__listHeader }>
                                    <h2>{ t('list.title') }</h2>
                                    <span>{ t('list.count', { count: isFiltering ? totalResults : totalResults + podium.length }) }</span>
                                </div>
                                {list.length > 0 ? (
                                    <RankingList
                                        testers={ list }
                                        hasMore={ hasMore }
                                        locale={ locale }
                                        t={ t }
                                        onOpen={ onOpenTester }
                                        onShowMore={ onShowMore }
                                    />
                                ) : isFiltering && (
                                    <div className={ styles.topTesters__empty } role="status">
                                        <p>{ t('empty.title') }</p>
                                        <span>{ t('empty.search') }</span>
                                    </div>
                                )}
                            </section>
                        </>
                    )}
                </motion.div>
            </AnimatePresence>

            <footer className={ styles.topTesters__notes }>
                <p>{ period === 'all' ? t('notes.allTime') : isCurrentMonth ? t('notes.inProgress') : null }</p>
                {updatedLabel && <p>{ updatedLabel }</p>}
            </footer>
        </Container>
    );
};

export { TopTestersView }
