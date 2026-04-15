import { useState, type JSX } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useChatBotStore } from '../../stores/chatBot.store';

import styles from './botSendMessage.module.css';
import iconSend from '@/config/assets/png/icon-send.png';

const BotSendMessage = ():JSX.Element => {
    const [value, setValue] = useState<string>('');
    const isChatEnabled = useChatBotStore( state => state.isChatEnabled );
    const setIsChatEnabled = useChatBotStore( state => state.setIsChatEnabled );
    const atrFieldAnswer = useChatBotStore( state => state.atrFieldAnswer );
    const setAtrFieldAnswer = useChatBotStore( state => state.setAtrFieldAnswer );
    const setMessagesSaved = useChatBotStore( state => state.setMessagesSaved );
    const setMessage = useChatBotStore( state => state.setMessage );
    const setErrorInMessage = useChatBotStore( state => state.setErrorInMessage );
    const setIsLoad = useChatBotStore( state => state.setIsLoad );

    const handleSaveMessage = () => {
        if(value.length === 0){
            return setErrorInMessage(`the ${atrFieldAnswer.name} cannot be empty`);
        }
        setIsLoad(true);
        // Save values
        setMessage({
            text: value,
            userResponse: true,
            delayMessage: 0
        });
        setMessagesSaved({ [atrFieldAnswer.name]: value });
        // Reset
        setValue('');
        setIsChatEnabled(false);
        setAtrFieldAnswer({ name: '', placeholder: '' });
    }

    return (
        <form className={ `${styles.BotSendMessage} ${!isChatEnabled && 'opacity-65'}` }>
            <input 
                type="text" 
                name={ atrFieldAnswer.name } 
                id={ atrFieldAnswer.name } 
                placeholder={ atrFieldAnswer.placeholder } 
                disabled={ !isChatEnabled } 
                value={ value }
                onChange={ (e)=> setValue(e.target.value) }
            />
            <motion.button 
                disabled={ !isChatEnabled } 
                type='button'
                onClick={ handleSaveMessage }
                whileTap={{ scale: 0.95 }} 
                whileHover={{ scale: 1.05 }}
            >
                <Image src={ iconSend } alt="Send icon navy" />
            </motion.button>
        </form>
    )
}

export { BotSendMessage }