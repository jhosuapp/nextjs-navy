import type { JSX } from "react";
import { motion } from 'framer-motion';
import { Container } from "@/shared/components/container/Container"
import { CardWrappersecondary } from "@/shared/components/card-wrapper-secondary/CardWrapperSecondary"
import { LoaderSecondary } from "@/shared/components/loader/LoaderSecondary"
import { Button } from "@/shared/components/button/Button"
import { NotFound } from "@/shared/components/not-found/NotFound"
import { Feedback } from "@/shared/components/feedback/Feedback"
import { CardBan  } from "../components"
import { fadeInMotion } from "@/shared/motion/fadeIn.motion";
import { useBansController } from '../hooks';

const BansView = ():JSX.Element => {
    const { 
        response, 
        activeBansPaginated,
        activeBans, 
        getDuration,
        handleLoadMoreActive,
        value,
        t
    } = useBansController();

    if(response.isLoading){
        return (
            <Container className="!mt-5 lg:!mt-10" isFirst isLast>
                <LoaderSecondary textLoader={ t('loading') }/>
            </Container>
        )
    }

    return (
        <Container className="!mt-5 lg:!mt-10" isFirst isLast>
            <CardWrappersecondary 
                title={ t('hero.active') } 
                placeholder={ t('hero.search') }
                text={``} 
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
                {activeBansPaginated.visibleItems.map((data, index)=>(
                    <motion.div {...fadeInMotion(getDuration(index), 1)} key={`${data.nick}-${index}-actives`}>
                        <CardBan 
                            key={ `${data.nick}-${index}` }
                            data={ data }
                            isFadeUp={ !value && index <= 5 }
                            t={ t }
                        />
                    </motion.div>
                ))}
            </CardWrappersecondary>
            {activeBansPaginated.hasMore && (
                <motion.div className='flex justify-center w-full mt-10' {...fadeInMotion(0,0)}>
                    <Button
                        onClick={ handleLoadMoreActive }
                        text={t('cta')} 
                        style={'secondary' } 
                    />
                </motion.div>
            )}

            {/* {inactiveBans.length && (
                <CardWrappersecondary title={ `Inactive bans` } text={`${inactiveBans.length} Users`}>
                    {inactiveBansPaginated.visibleItems.map((data, index)=>(
                        <motion.div {...fadeInMotion(index <= 5 ? 0.5 : getDuration(index), 1)}>
                            <CardBan 
                                key={ `${data.nick}-${index}` }
                                data={ data }
                                isFadeUp={ index <= 5 }
                                variantStatus="inactive"
                            />
                        </motion.div>
                    ))}
                </CardWrappersecondary>
            )}
            {inactiveBansPaginated.hasMore && (
                <motion.div className='flex justify-center w-full mt-10' {...fadeInMotion(0,0)}>
                    <Button
                        onClick={ handleLoadMoreInactive }
                        text={'Load more players'} 
                        style={'secondary' } 
                    />
                </motion.div>
            )} */}
        </Container>
    )
}

export { BansView }