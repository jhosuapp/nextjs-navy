import { useEffect, useRef } from 'react';
import { useChatBotStore } from '../stores/chatBot.store';

const useBotWrapperController = () => {
    const messages = useChatBotStore( state => state.messages );
    const isTyping = useChatBotStore( state => state.isTyping );
    const setIsTyping = useChatBotStore( state => state.setIsTyping );
    const setResetBot = useChatBotStore( state => state.setResetBot );
    const containerRef = useRef<HTMLDivElement>(null);

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
    }, [messages, isTyping]);

    return {
        handleCloseBot,
        setIsTyping, 
        containerRef,
        messages, 
        isTyping
    }
}

export { useBotWrapperController }