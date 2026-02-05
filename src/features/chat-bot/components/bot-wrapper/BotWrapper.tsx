import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatBotStore } from '../../stores/chatBot.store';
import { zoomInMotion } from '@/shared/motion';
import { BotSendMessage } from '../bot-send-message/BotSendMessage';
import { BotMessage } from '../bot-message/BotMessage';
import { BotMessageTyping } from '../bot-message/BotMessageTyping';

import styles from './botWrapper.module.css';
import iconBot from '@/config/assets/png/icon-bot.webp';
import bg from '@/config/assets/svg/bg-chat.svg';
import { RadioStep } from '../steps/radio-step/RadioStep';

const BotWrapper = ():JSX.Element => {
    const setEnableBot = useChatBotStore( state => state.setEnableBot );
    const messages = useChatBotStore( state => state.messages );
    const isTyping = useChatBotStore( state => state.isTyping );
    const setIsTyping = useChatBotStore( state => state.setIsTyping );
    
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
                    {messages.map((item, index) => (
                        <BotMessage 
                            key={index}
                            text={ item.text } 
                            delayMessage={ item.delayMessage } 
                            userResponse={ item.userResponse }
                            isLast={index === messages.length - 1}
                            onAnimationComplete={() => setIsTyping(false)}
                        />
                    ))}
                    <AnimatePresence>
                        {isTyping ? (
                            <BotMessageTyping />
                        ) : (
                            <>
                                <RadioStep 
                                    options={[{ name: 'oldUserName', value: 'My old username appears' }]} 
                                    messages={[{ text: 'Let"s update it!', delayMessage: 1.5 }, { text: 'But first, select one of the following options:', delayMessage: 3.5 }]}
                                    enableAtStep={1}
                                    enableNextStep={2}
                                />
                                <RadioStep 
                                    options={[{ name: 'Im premium', value: 'Im premium' }, { name: 'Im not premium', value: 'Im not premium' }]} 
                                    messages={[{ text: 'Let"s update it!', delayMessage: 1.5 }, { text: 'But first, select one of the following options:', delayMessage: 3.5 }]}
                                    enableAtStep={2}
                                    enableNextStep={3}
                                />
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </article>
            <article>
                <BotSendMessage />
            </article>
        </motion.section>
    )
}

export { BotWrapper }