import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { fadeInMotion, zoomInMotion } from '@/shared/motion';
import { useChatBotStore } from '../../stores/chatBot.store';

import styles from './botSticky.module.css';
import iconBot from '@/config/assets/png/icon-bot.webp';

const BotSticky = ():JSX.Element => {
    const [showMessage, setShowMessage] = useState<boolean>(true);
    const setEnableBot = useChatBotStore( state => state.setEnableBot );
    const setIsTyping = useChatBotStore( state => state.setIsTyping );

    setTimeout(()=>{
        setShowMessage(false);
    },5500);

    return (
        <motion.div className={ styles.botSticky } {...zoomInMotion(3,0)}>
            <motion.button 
                whileTap={{ scale: 0.95 }} 
                whileHover={{ scale: 1.05 }}
                onClick={ ()=> { setEnableBot(true), setIsTyping(true) } }
            >
                <Image src={ iconBot } alt='Bot' />
                <span></span>
                <motion.span {...fadeInMotion(1,0)}>1</motion.span>
            </motion.button>
            <motion.div {...zoomInMotion(2,0)} className={ `${styles.botSticky__message} ${!showMessage && styles.botSticky__message__disabled}` }>
                <p>Hi! How can I help you?</p>
            </motion.div>
        </motion.div>
    )
}

export { BotSticky }