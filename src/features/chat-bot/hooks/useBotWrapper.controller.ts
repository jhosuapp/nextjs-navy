import { useEffect, useRef } from 'react';
import { useChatBotStore } from '../stores/chatBot.store';

const useBotWrapperController = () => {
    const messages = useChatBotStore( state => state.messages );
    const isTyping = useChatBotStore( state => state.isTyping );
    const isLoad = useChatBotStore( state => state.isLoad );
    const setIsTyping = useChatBotStore( state => state.setIsTyping );
    const setResetBot = useChatBotStore( state => state.setResetBot );
    const errorInMessage = useChatBotStore( state => state.errorInMessage );
    const setErrorInMessage = useChatBotStore( state => state.setErrorInMessage );
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        if(errorInMessage !== ''){
            setTimeout(()=>{
                setErrorInMessage('')
            },5000);
        }
    },[errorInMessage]);

    const scrollToBottom = () => {
        if (containerRef.current) {
            setTimeout(()=>{
                containerRef?.current?.scrollTo({
                    top: containerRef?.current?.scrollHeight,
                    behavior: 'smooth'
                });
            },100);
        }
    };

    const handleCloseBot = () => {
        setResetBot();
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, isLoad]);

    return {
        handleCloseBot,
        setIsTyping, 
        containerRef,
        messages, 
        isTyping, 
        errorInMessage, 
        isLoad
    }
}

export { useBotWrapperController }