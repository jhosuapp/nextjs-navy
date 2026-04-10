import { fadeInMotion } from '@/shared/motion';
import { AnimatePresence, motion } from 'framer-motion';
import { TierDataOverallItem } from './TierDataOverallItem';
import { useTierlistOverall } from '../../hooks';
import { Button, LoaderSecondary } from '@/shared/components';
import { getCombatTitleByPoints } from '../../helpers/getCombatTitlePointsHelper';
import { anchorScroll } from '@/shared/helpers';
import { useLenisStore } from '@/shared/stores';
import { ITranslations } from '@/shared/interfaces';

import styles from './tierDataOverall.module.css';

type Props = {
    t: ITranslations;
}

const TierDataOverall = ({ t }:Props):JSX.Element => {
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
                    <p>{ t('tableHead.player') }</p>
                </div>
                <div>
                    <p>{ t('tableHead.region') }</p>
                </div>
                <div>
                    <p>{ t('tableHead.tiers') }</p>
                </div>
            </div>
            <AnimatePresence mode='wait'>   
                {tierlist.isLoading ? (
                    <LoaderSecondary textLoader={ t('feedback.overallLoader') } key={`${tierlist.isLoading}-loader`} />
                ) : (
                    <>
                        {data.map((item, index)=>{
                            const combatData = getCombatTitleByPoints(item.points);
                            const combatTitleLower = combatData.title.toLowerCase();

                            return (
                                <TierDataOverallItem 
                                    username={ item.nick }
                                    tierSword={ item?.games?.sword?.tier }
                                    tierNetherite={ item?.games?.netherite?.tier }
                                    tierCrystal={ item?.games?.crystal?.tier }
                                    position={ index + 1 }
                                    continent={ item.region }
                                    combat_title={ `${t(`information.${combatTitleLower}.title`)} (${item.points} ${t('information.points')})` }
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
                                text={ tierlist.isFetchingNextPage ? t('feedback.ctaLoader') : t('cta')} style={'secondary' } 
                            />
                        </div>
                    </>
                )}
            </AnimatePresence>
        </motion.article>
    )
}

export { TierDataOverall }