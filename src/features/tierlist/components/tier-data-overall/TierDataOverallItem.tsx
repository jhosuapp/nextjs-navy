import type { JSX } from "react";
import { motion } from 'framer-motion';
import { CardBody, ChipModalities, ChipRegions, PropsChipRegions } from "@/shared/components";
import { Tiers } from "@/shared/interfaces";
import { useModalStore, useSkinStore } from "@/shared/stores";

import styles from './tierDataOverall.module.css';
import { fadeInMotion } from '@/shared/motion';


type Props = {
    username: string;
    position: number;
    combat_title: string;
    combat_img: string;
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
    continent,
    combat_title,
    combat_img,
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
            <CardBody username={ username }>
                <p className={ styles.tierDataOverallItem__combatInfo }>
                    <img src={`/images/${combat_img}`} alt={ `Navy ${combat_title}` } />
                    { combat_title }
                </p>
            </CardBody>
            <div className={ styles.tierDataOverallItem__region }>
                <ChipRegions continent={ continent } />
            </div>
            <div className={ styles.tierDataOverallItem__tiers }>
                <ChipModalities 
                    modalitie="sword" 
                    variant="blue" 
                    modalitieImage="sword.webp" 
                    tier={ tierSword }
                    disabled={ !tierSword }
                />
                <ChipModalities 
                    modalitie="netherite" 
                    variant="purple" 
                    modalitieImage="netherite.webp" 
                    tier={ tierNetherite }
                    disabled={ !tierNetherite }
                />
                <ChipModalities 
                    modalitie="crystal" 
                    variant="pink" 
                    modalitieImage="crystal.webp" 
                    tier={ tierCrystal }
                    disabled={ !tierCrystal }
                />
            </div>
        </motion.div>
    )
}

export { TierDataOverallItem }