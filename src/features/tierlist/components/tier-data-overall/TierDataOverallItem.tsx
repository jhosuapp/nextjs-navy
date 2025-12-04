import { motion } from 'framer-motion';
import { ChipModalities, ChipRegions, PropsChipRegions } from "@/shared/components";
import { Tiers } from "@/shared/interfaces";
import { useModalStore, useSkinStore } from "@/shared/stores";

import styles from './tierDataOverall.module.css';
import { fadeInMotion } from '@/shared/motion';

type Props = {
    username: string;
    position: number;
    tierSword: Tiers;
    tierNetherite: Tiers;
    tierCrystal: Tiers;
    delay?: { enter: number, exit: number  };
} & PropsChipRegions;

const TierDataOverallItem = ({ 
    username,
    position,
    tierSword,
    tierNetherite,
    tierCrystal,
    variantRegions,
    continent,
    delay = { enter: 0, exit: 0 }
}:Props):JSX.Element => {
    const setSkin = useSkinStore(state => state.setSkin);
    const setShowModal = useModalStore(state => state.setShowModal);

    const hanldeOnClick = () => {
        setSkin(username);
        setShowModal(true);
    };

    return (
        <motion.div 
            className={ styles.tierDataOverallItem } 
            onClick={ hanldeOnClick }
            whileTap={{ scale: 0.95 }} 
            whileHover={{ scale: 1.01 }}
            {...fadeInMotion(delay.enter, delay.exit)}
        >
            <div className={ styles.tierDataOverallItem__position }>
                <p>{ position }</p>
            </div>
            <div className={ styles.tierDataOverallItem__skin }>
                <div className={ styles.tierDataOverallItem__skin__item }>
                    <img src={ `https://minotar.net/body/${username}` } alt={ username } />
                </div>
                <div>
                    <p>{ username }</p>
                    <p>Combat ace 130 points</p>
                </div>
            </div>
            <div className={ styles.tierDataOverallItem__region }>
                <ChipRegions variantRegions={ variantRegions }  continent={ continent } />
            </div>
            <div className={ styles.tierDataOverallItem__tiers }>
                <ChipModalities 
                    modalitie="Sword" 
                    variant="blue" 
                    modalitieImage="sword.webp" 
                    tier={ tierSword }
                />
                <ChipModalities 
                    modalitie="Netherite pot" 
                    variant="purple" 
                    modalitieImage="netherite.webp" 
                    tier={ tierNetherite }
                />
                <ChipModalities 
                    modalitie="Crystal" 
                    variant="pink" 
                    modalitieImage="crystal.webp" 
                    tier={ tierCrystal }
                />
            </div>
        </motion.div>
    )
}

export { TierDataOverallItem }