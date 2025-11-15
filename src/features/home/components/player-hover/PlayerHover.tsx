import { motion } from "framer-motion";
import { Skin3d } from "@/shared/components";
import { fadeInMotion, fadeUpMotion } from "@/shared/motion";

import styles from './playerHover.module.css';
import { CrownIcon } from "@/config/assets/icon";

const PlayerHover = ():JSX.Element => {

    return (
        <motion.div className={ styles.playerHover } {...fadeUpMotion(0.66, 0.13)}>
            <motion.div 
                className={ styles.playerHover__block }
                {...fadeInMotion(0,0)}
            >
                <CrownIcon />
                <motion.span
                    className={ styles.playerHover__title }
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
                    1. Jhosuapp
                </motion.span>
            </motion.div>
            <motion.div {...fadeInMotion(0.1, 0.1)}>
                <Skin3d 
                    walk
                    username={ 'YunaEz' }
                    autoRotate={ false }
                />
            </motion.div>
        </motion.div>
    )
}

export { PlayerHover }
