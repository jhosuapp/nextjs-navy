import type { JSX } from "react";
import { motion } from 'framer-motion';
import { Container } from "@/shared/components/container/Container"
import { CardWrappersecondary } from "@/shared/components/card-wrapper-secondary/CardWrapperSecondary"
import { Button } from "@/shared/components/button/Button"
import { NotFound } from "@/shared/components/not-found/NotFound"
import { Feedback } from "@/shared/components/feedback/Feedback"
import { CardBan } from "../components"
import { fadeInMotion } from "@/shared/motion/fadeIn.motion";
import { useBansController } from '../hooks';
import { fadeUpMotion } from "@/shared/motion/fadeUp.motion";
import { BansResponse } from "../interfaces";

type Props = {
    bans: BansResponse;
}

const BansView = ({ bans }: Props): JSX.Element => {
    const {
        activeBansPaginated,
        activeBans,
        getDuration,
        handleLoadMoreActive,
        value,
        t
    } = useBansController(bans);

    return (
        <Container className="!mt-5 lg:!mt-10" isFirst isLast>
            <CardWrappersecondary
                title={ t('hero.active') }
                placeholder={ t('hero.search') }
                hasSearch
                hasAnimation
            >
                {value && (
                    <NotFound
                        text={`${activeBans.length} ${t('search.users')}`}
                        description={t('search.resultsFound', { count: activeBans.length, value })}
                    />
                )}
                {value && !activeBans.length && (
                    <Feedback texFeedback={ t('search.resultsNotFound') } />
                )}
                {activeBansPaginated.visibleItems.map((data, index) => (
                    <motion.div
                        layout
                        {...fadeInMotion(getDuration(index), 1)}
                        key={`${data.nick}-bans-actives`}
                    >
                        <CardBan
                            data={ data }
                            isFadeUp={ false }
                            t={ t }
                        />
                    </motion.div>
                ))}
            </CardWrappersecondary>
            {activeBansPaginated.hasMore && (
                <motion.div className='flex justify-center w-full mt-10 relative overflow-hidden'>
                    <Button
                        onClick={ handleLoadMoreActive }
                        text={t('cta')}
                        style={'secondary'}
                        {...fadeUpMotion(0.56, 0.13)}
                    />
                </motion.div>
            )}
        </Container>
    )
}

export { BansView }
