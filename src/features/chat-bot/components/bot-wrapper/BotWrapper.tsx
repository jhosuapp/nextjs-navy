import Image from 'next/image';
import { motion } from 'framer-motion';
import { fadeInMotion, zoomInMotion } from '@/shared/motion';
import { BotSendMessage } from '../bot-send-message/BotSendMessage';
import { BotMessage } from '../bot-message/BotMessage';
import { BotMessageTyping } from '../bot-message/BotMessageTyping';
import { RadioStep } from '../steps/radio-step/RadioStep';
import { UpdateUserName } from '../steps/update-user-name/UpdateUserName';
import { useBotWrapperController } from '../../hooks/useBotWrapper.controller';
import { BotMessageLoad } from '../bot-message/BotMessageLoad';

import styles from './botWrapper.module.css';
import iconBot from '@/config/assets/png/icon-bot.webp';
import bg from '@/config/assets/svg/bg-chat.svg';

const BotWrapper = ():JSX.Element => {

    const { 
        handleCloseBot,
        containerRef, 
        messages,
        isTyping, 
        setIsTyping, 
        errorInMessage,
        isLoad
    } = useBotWrapperController();
    
    return (
        <motion.section className={ styles.botWrapper } {...zoomInMotion(0,0)}>
            <article className={ styles.botWrapperNav }>
                <div className={ styles.botWrapperNav__name }>
                    <Image src={ iconBot } alt='icon bot navy' />
                    <p>Navy bot</p>
                </div>
                <button className={ styles.botWrapperNav__action } onClick={ handleCloseBot }>
                    <span></span>
                </button>
            </article>
            <article className={ styles.botWrapper__content }>
                <Image src={bg} alt='bg' className={ styles.botWrapper__bg } />
                <div 
                    className={ styles.botWrapper__content__block } 
                    data-lenis-prevent="true"
                    ref={containerRef}
                >
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
                            {/* Flux for update username */}
                            <UpdateUserName />
                        </>
                    )}
                    {isLoad && (
                        <BotMessageLoad />
                    )}
                </div>
            </article>
            <article>
                <BotSendMessage />
            </article>
            {errorInMessage && <p className={ styles.botWrapper__error } {...fadeInMotion(0,0)}>{ errorInMessage }</p>}
        </motion.section>
    )
}

export { BotWrapper }