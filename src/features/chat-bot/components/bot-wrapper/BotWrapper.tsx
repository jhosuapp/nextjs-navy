import Image from 'next/image';
import { motion } from 'framer-motion';
import { useChatBotStore } from '../../stores/chatBot.store';
import { zoomInMotion } from '@/shared/motion';


import styles from './botWrapper.module.css';
import iconBot from '@/config/assets/png/icon-bot.webp';
import bg from '@/config/assets/svg/bg-chat.svg';
import { BotSendMessage } from '../bot-send-message/BotSendMessage';
import { BotMessage } from '../bot-message/BotMessage';

const BotWrapper = ():JSX.Element => {
    const setEnableBot = useChatBotStore( state => state.setEnableBot );
    
    return (
        <motion.section className={ styles.botWrapper } {...zoomInMotion(0,0)}>
            <article className={ styles.botWrapperNav }>
                <div className={ styles.botWrapperNav__name }>
                    <Image src={ iconBot } alt='icon bot navy' />
                    <p>Navy bot</p>
                </div>
                <button className={ styles.botWrapperNav__action } onClick={ ()=> setEnableBot(false) }>
                    <span></span>
                </button>
            </article>
            <article className={ styles.botWrapper__content }>
                <Image src={bg} alt='bg' className={ styles.botWrapper__bg } />
                <div className={ styles.botWrapper__content__block } data-lenis-prevent="true">
                    <BotMessage text='Hi, soy navy bot' />
                    <BotMessage text='Hi, soy navy bot' userResponse />
                    <BotMessage text='Hi, soy navy bot' />
                    <BotMessage text='Hi, soy navy bot' userResponse />
                    <BotMessage text='Hi, soy navy bot' />
                    <BotMessage text='Hi, soy navy bot' />
                </div>
            </article>
            <article>
                <BotSendMessage />
            </article>
        </motion.section>
    )
}

export { BotWrapper }