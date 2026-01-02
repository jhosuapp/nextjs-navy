import { fadeInMotion } from '@/shared/motion';
import { motion } from 'framer-motion';
import { TierDataOverallItem } from './TierDataOverallItem';
import { useTierlistOverall } from '../../hooks';

import styles from './tierDataOverall.module.css';
import { Button } from '@/shared/components';

const TierDataOverall = ():JSX.Element => {
    const tierlist = useTierlistOverall();
    const data = tierlist.data?.pages.flatMap(page => page.data) ?? []

    return (
        <motion.article {...fadeInMotion(0, 0.4)}>
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
            {data.map((item, index)=>(
                <TierDataOverallItem 
                    username={ item.nick }
                    tierSword={ item?.games?.sword?.tier }
                    tierNetherite={ item?.games?.netherite?.tier }
                    tierCrystal={ item?.games?.crystal?.tier }
                    position={ index + 1 }
                    continent={ item.region }
                    points={ item.points }
                    delay={ { enter: (index % 10) * 0.1, exit: (index % 10) * 0.1} }
                    key={ `${item.nick}-${index}-${item.points}` }
                />
            ))}
            <div className={ styles.tierDataOverallInfoButton }>
                <Button 
                    onClick={ ()=> tierlist.fetchNextPage() }
                    disabled={ tierlist.isFetchingNextPage }
                    text={ tierlist.isFetchingNextPage ? 'Loading...' : 'Load more players'} style={'secondary' } 
                />
            </div>
        </motion.article>
    )
}

export { TierDataOverall }