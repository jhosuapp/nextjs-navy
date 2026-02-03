import Image from 'next/image';
import { motion } from 'framer-motion';
import { useChatBotStore } from '../../stores/chatBot.store';


import styles from './botWrapper.module.css';
import iconBot from '@/config/assets/png/icon-bot.webp';
import { zoomInMotion } from '@/shared/motion';

const BotWrapper = ():JSX.Element => {
    const setEnableBot = useChatBotStore( state => state.setEnableBot );
    
    return (
        <motion.section className={ styles.botWrapper } {...zoomInMotion(0,0)}>
            <div className={ styles.botWrapperNav }>
                <div className={ styles.botWrapperNav__name }>
                    <Image src={ iconBot } alt='icon bot navy' />
                    <p>Navy bot</p>
                </div>
                <button className={ styles.botWrapperNav__action } onClick={ ()=> setEnableBot(false) }>
                    <span></span>
                </button>
            </div>
        </motion.section>
    )
}

export { BotWrapper }