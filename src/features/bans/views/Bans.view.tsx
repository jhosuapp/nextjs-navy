import { motion } from 'framer-motion';
import { Container, CardWrappersecondary, LoaderSecondary, Button, NotFound, Feedback } from "@/shared/components"
import { CardBan  } from "../components"
import { fadeInMotion } from "@/shared/motion";
import { useBansController } from '../hooks';

const BansView = ():JSX.Element => {
    const { 
        response, 
        activeBansPaginated,
        activeBans, 
        getDuration,
        handleLoadMoreActive,
        value
    } = useBansController();

    if(response.isLoading){
        return (
            <Container className="!mt-5 lg:!mt-10" isFirst isLast>
                <LoaderSecondary textLoader="Loading staff team"/>
            </Container>
        )
    }

    return (
        <Container className="!mt-5 lg:!mt-10" isFirst isLast>
            <CardWrappersecondary title={ `Active` } text={``} hasSearch hasAnimation>
                {value && (
                    <NotFound 
                        text={`${activeBans.length} Users`}
                        description={`We found ${activeBans.length} results for the search "${value}"`}
                    />
                )}
                {value && !activeBans.length && (
                    <Feedback texFeedback='We did not find results' />
                )}
                {activeBansPaginated.visibleItems.map((data, index)=>(
                    <motion.div {...fadeInMotion(getDuration(index), 1)}>
                        <CardBan 
                            key={ `${data.nick}-${index}` }
                            data={ data }
                            isFadeUp={ !value && index <= 5 }
                        />
                    </motion.div>
                ))}
            </CardWrappersecondary>
            {activeBansPaginated.hasMore && (
                <motion.div className='flex justify-center w-full mt-10' {...fadeInMotion(0,0)}>
                    <Button
                        onClick={ handleLoadMoreActive }
                        text={'Load more players'} 
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