import { fadeInMotion } from '@/shared/motion';
import { motion } from 'framer-motion';
import { TierDataOverallItem } from './TierDataOverallItem';

import styles from './tierDataOverall.module.css';

const TierDataOverall = ():JSX.Element => {
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
            {dummyDataFourth.map((data:any, index)=>(
                <TierDataOverallItem 
                    username={ data.username }
                    tierSword={ data.tierSword }
                    tierNetherite={ data.tierNetherite }
                    tierCrystal={ data.tierCrystal }
                    position={ index + 1 }
                    continent={ data.continent }
                    variantRegions={ data.variantRegions }
                    delay={ { enter: index * 0.1, exit: (dummyDataFourth.length - 1 - index) * 0.1 } }
                />
            ))}
        </motion.article>
    )
}

export const dummyDataFourth = [
    {
        username: 'dream',
        modalitie: 'Sword',
        variant: 'blue',
        modalitieImage: 'sword.webp',
        continent: 'EU',
        variantRegions: 'green',
        tierSword: 'lt1',
        tierNetherite: 'lt2',
        tierCrystal: 'ht1',
    },
    {
        username: 'ichigo',
        modalitie: 'Netherite poth',
        variant: 'purple',
        modalitieImage: 'netherite.webp',
        continent: 'SA',
        variantRegions: 'orange',
        tierSword: 'lt1',
        tierNetherite: 'lt2',
        tierCrystal: 'ht1',
    },
    {
        username: 'kaneki',
        modalitie: 'Sword',
        variant: 'blue',
        modalitieImage: 'sword.webp',
        continent: 'NA',
        variantRegions: 'blue',
        tierSword: 'lt1',
        tierNetherite: 'lt2',
        tierCrystal: 'ht1',
    },
    {
        username: 'kakashi',
        modalitie: 'Netherite poth',
        variant: 'purple',
        modalitieImage: 'netherite.webp',
        continent: 'AS',
        variantRegions: 'purple',
        tierSword: 'lt1',
        tierNetherite: 'lt2',
        tierCrystal: 'ht1',
    },
    {
        username: 'kaneki',
        modalitie: 'Sword',
        variant: 'blue',
        modalitieImage: 'sword.webp',
        continent: 'NA',
        variantRegions: 'blue',
        tierSword: 'lt1',
        tierNetherite: 'lt2',
        tierCrystal: 'ht1',
    },
    {
        username: 'kakashi',
        modalitie: 'Netherite poth',
        variant: 'purple',
        modalitieImage: 'netherite.webp',
        continent: 'AS',
        variantRegions: 'purple',
        tierSword: 'lt1',
        tierNetherite: 'lt2',
        tierCrystal: 'ht1',
    },
] as any;

export { TierDataOverall }