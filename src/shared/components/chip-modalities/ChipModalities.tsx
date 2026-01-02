import { Modalitie, ModalitieImage, ModalitiesVariants, Tiers } from "@/shared/interfaces";
import { useModalitieStore } from "@/shared/stores";
import { motion } from 'framer-motion';

import styles from './chipModalities.module.css';

export type PropsChipModalities = {
    variant: ModalitiesVariants;
    modalitie: Modalitie;
    modalitieImage: ModalitieImage;
    isButton?: boolean;
    showModalitie?: boolean;
    disabled?: boolean;
    tier?: Tiers;
}

const ChipModalities = ({ variant, modalitie, modalitieImage, isButton = false, showModalitie = false, disabled = false, tier = null }:PropsChipModalities):JSX.Element => {
    const setCurrentModalitie = useModalitieStore( state => state.setCurrentModalitie );
    const currentModalitie = useModalitieStore( state => state.currentModalitie );

    const handleClickModalitie = () => {
        setCurrentModalitie(modalitie)
    }

    return (
        <motion.div 
            className={ `
                ${styles.chipModalities} 
                ${styles[`chipModalities${variant}`]} 
                ${isButton && styles.chipModalitiesButton} 
                ${showModalitie && styles.chipModalitiesDesc} 
                ${tier && styles.chipModalitiesTier} 
                ${showModalitie && tier && styles.chipModalites__enable}
                ${tier === null && disabled && `${styles.chipModalitiesTier} ${styles.chipModalitiesTierDisabled}`}
                ${currentModalitie === modalitie && isButton && styles.chipModalitiesActive}` 
            }
            onClick={ ()=> isButton && handleClickModalitie() }
            whileTap={{ scale: 0.95 }} 
            whileHover={{ scale: 1.05 }}
        >
            <div className={ styles.chipModalities__image }>
                <img src={`/images/${modalitieImage}`} alt="icono navy" />
            </div>
            <div>
                {showModalitie && (
                    <p>{ modalitie }</p>
                )}
                {tier && (
                    <span>{ tier }</span>
                )}
            </div>
        </motion.div>
    )
}

export { ChipModalities }