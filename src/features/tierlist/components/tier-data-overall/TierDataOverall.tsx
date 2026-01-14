import { fadeInMotion } from '@/shared/motion';
import { AnimatePresence, motion } from 'framer-motion';
import { TierDataOverallItem } from './TierDataOverallItem';
import { useTierlistOverall } from '../../hooks';
import { Button, LoaderSecondary } from '@/shared/components';
import { getCombatTitleByPoints } from '../../helpers/getCombatTitlePointsHelper';
import { anchorScroll } from '@/shared/helpers';
import { useLenisStore } from '@/shared/stores';

import styles from './tierDataOverall.module.css';

const TierDataOverall = ():JSX.Element => {
    const tierlist = useTierlistOverall();
    const lenis = useLenisStore(state => state.lenis);    
    const data = tierlist.data?.pages.flatMap(page => page.data) ?? []

    return (
        <motion.article {...fadeInMotion(0, 0)}>
            <div className={ styles.tierDataOverallInfo }>
                <div>
                    <p>#</p>
                </div>
                <div>
                    <p>player</p>
                </div>
                <div>
                    <p>Region</p>
                </div>
                <div>
                    <p>Tiers</p>
                </div>
            </div>
            <AnimatePresence mode='wait'>   
                {tierlist.isLoading ? (
                    <LoaderSecondary textLoader='Loading players' key={`${tierlist.isLoading}-loader`} />
                ) : (
                    <>
                        {data.map((item, index)=>{
                            const combatData = getCombatTitleByPoints(item.points);

                            return (
                                <TierDataOverallItem 
                                    username={ item.nick }
                                    tierSword={ item?.games?.sword?.tier }
                                    tierNetherite={ item?.games?.netherite?.tier }
                                    tierCrystal={ item?.games?.crystal?.tier }
                                    position={ index + 1 }
                                    continent={ item.region }
                                    combat_title={ `${combatData.title} (${item.points} points)` }
                                    combat_img={ combatData.img }
                                    delay={ { enter: (index % 10) * 0.1, exit: (index % 10) * 0.1} }
                                    key={ `${item.nick}-${index}-${item.points}` }
                                />
                            )
                        })}
                        <div className={ styles.tierDataOverallInfoButton }>
                            <Button 
                                onClick={ ()=> { tierlist.fetchNextPage(), anchorScroll(lenis) } }
                                disabled={ tierlist.isFetchingNextPage }
                                text={ tierlist.isFetchingNextPage ? 'Loading...' : 'Load more players'} style={'secondary' } 
                            />
                        </div>
                    </>
                )}
            </AnimatePresence>
        </motion.article>
    )
}

export { TierDataOverall }