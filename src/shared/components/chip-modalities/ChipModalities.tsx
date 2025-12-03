import { Modalitie, ModalitieImage, ModalitiesVariants } from "@/shared/interfaces";
import { useModalitieStore } from "@/shared/stores";
import { motion } from 'framer-motion';

import styles from './chipModalities.module.css';

export type PropsChipModalities = {
    variant: ModalitiesVariants;
    modalitie: Modalitie;
    modalitieImage: ModalitieImage;
    isButton?: boolean;
    showModalitie?: boolean;
}

const ChipModalities = ({ variant, modalitie, modalitieImage, isButton = false, showModalitie = false }:PropsChipModalities):JSX.Element => {
    const setCurrentModalitie = useModalitieStore( state => state.setCurrentModalitie );

    const handleClickModalitie = () => {
        setCurrentModalitie(modalitie)
    }

    return (
        <motion.div 
            className={ `${styles.chipModalities} ${styles[`chipModalities${variant}`]} ${isButton && styles.chipModalitiesButton} ${showModalitie && styles.chipModalitiesDesc}` }
            onClick={ ()=> isButton && handleClickModalitie() }
            whileTap={{ scale: 0.95 }} 
            whileHover={{ scale: 1.05 }}
        >
            <div className={ styles.chipModalities__image }>
                <img src={`/images/${modalitieImage}`} alt="icono navy" />
            </div>
            {showModalitie && (
                <p>{ modalitie }</p>
            )}
        </motion.div>
    )
}

export { ChipModalities }