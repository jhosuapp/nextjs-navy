import { AnimatePresence, motion } from "framer-motion";
import { Skin3d } from "@/shared/components";
import { fadeInMotion, fadeUpMotion } from "@/shared/motion";

import styles from './playerHover.module.css';
import { CrownIcon } from "@/config/assets/icon";

type Props = {
    username: string;
}

const PlayerHover = ({ username }:Props):JSX.Element => {

    return (
        <AnimatePresence mode="wait">
            <motion.div className={ styles.playerHover } {...fadeInMotion(0.66, 0.13)} key={ username }>
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
                        { username }
                    </motion.span>
                </motion.div>
                <motion.div {...fadeInMotion(0.1, 0.1)}>
                    <Skin3d 
                        walk
                        username={ username }
                        autoRotate={ false }
                    />
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

export { PlayerHover }
