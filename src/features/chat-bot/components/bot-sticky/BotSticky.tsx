import { useEffect, useState, type JSX } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import { fadeInMotion } from '@/shared/motion/fadeIn.motion';
import { zoomInMotion  } from '@/shared/motion/zoomIn.motion';
import { useChatBotStore } from '../../stores/chatBot.store';

import styles from './botSticky.module.css';
import iconBot from '@/config/assets/png/icon-bot.webp';

const BotSticky = ():JSX.Element => {
    const { t } = useTranslation("common");
    const [showMessage, setShowMessage] = useState<boolean>(true);
    const enableBot = useChatBotStore( state => state.enableBot );
    const setEnableBot = useChatBotStore( state => state.setEnableBot );

    useEffect(() => {
        const timeout = setTimeout(() => setShowMessage(false), 5500);
        return () => clearTimeout(timeout);
    }, []);

    const handleEnableBot = () => {
        setEnableBot(true);
    }

    // Hide the floating button while the chat panel is open
    if (enableBot) return <></>;

    return (
        <motion.div className={ styles.botSticky } {...zoomInMotion(3,0)} onClick={ handleEnableBot }>
            <motion.button
                type='button'
                aria-label={ t('chatBot.tooltip') }
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
            >
                <Image src={ iconBot } width={48} height={48} alt='Bot' />
                <span></span>
                <motion.span {...fadeInMotion(1,0)}>1</motion.span>
            </motion.button>
            <motion.div {...zoomInMotion(2,0)} className={ `${styles.botSticky__message} ${!showMessage && styles.botSticky__message__disabled}` }>
                <p>{ t('chatBot.tooltip') }</p>
            </motion.div>
        </motion.div>
    )
}

export { BotSticky }
