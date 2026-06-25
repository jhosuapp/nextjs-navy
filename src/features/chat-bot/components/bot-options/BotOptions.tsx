import type { JSX } from "react";
import { motion } from "framer-motion";
import { fadeInMotion } from "@/shared/motion/fadeIn.motion";
import { BotOption } from "../../interfaces/chatBot.interface";
import { ITranslations } from "@/shared/interfaces/globals";

import styles from "./botOptions.module.css";

type Props = {
    options: BotOption[];
    onSelect: (option: BotOption) => void;
    t: ITranslations;
};

const BotOptions = ({ options, onSelect, t }: Props): JSX.Element => {
    return (
        <motion.div className={ styles.botOptions } {...fadeInMotion(0, 0)}>
            {options.map((option) => (
                <motion.button
                    key={ option.id }
                    type="button"
                    className={ styles.botOptions__chip }
                    onClick={ () => onSelect(option) }
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: 1.02 }}
                >
                    { t(option.labelKey) }
                </motion.button>
            ))}
        </motion.div>
    )
}

export { BotOptions }
