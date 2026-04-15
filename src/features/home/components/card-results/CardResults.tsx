import type { JSX } from "react";
import { motion } from 'framer-motion';
import { ChipModalities, PropsChipModalities } from '@/shared/components/chip-modalities/ChipModalities';
import { CrownIcon } from '@/config/assets/icon/CrownIcon';
import { useModalStore } from '@/shared/stores/modal.store';
import { useSkinStore } from '@/shared/stores/skin.store';

import styles from './cardResults.module.css';

type Props = {
    nick: string; 
} & PropsChipModalities

const CardResults = ({ nick, modalitie, modalitieImage, tier }:Props):JSX.Element => {
    const setSkin = useSkinStore(state => state.setSkin);
    const setShowModal = useModalStore(state => state.setShowModal);

    const hanldeOnClick = () => {
        setSkin(nick)
        setShowModal(true);
    };

    return (
        <div className={ styles.cardResults } onClick={hanldeOnClick}>
            <div className={ styles.cardResults__info }>
                <ChipModalities modalitie={ modalitie } modalitieImage={ modalitieImage } tier={ tier } />
                <CrownIcon />
            </div>
            <div className={ styles.cardResults__content }>
                <img loading='lazy' className={ styles.cardResults__skin } src={ `https://render.crafty.gg/3d/full/${nick}` } alt={ nick } />
                <motion.span
                    className={ styles.cardResults__player }
                    animate={{
                        backgroundImage: [
                        "linear-gradient(45deg, #ff8a00, #e52e71)",
                        "linear-gradient(45deg, #e52e71, #6617cb)",
                        "linear-gradient(45deg, #6617cb, #00cc99)",
                        "linear-gradient(45deg, #00cc99, #ff8a00)",
                    ],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                        repeatType: "reverse"
                    }}
                >
                    { nick }
                </motion.span>
            </div>
        </div>
    )
}

export { CardResults }