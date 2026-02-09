import { useEffect, useRef } from 'react';
import { useChatBotStore } from '../stores/chatBot.store';

const useBotWrapperController = () => {
    const setEnableBot = useChatBotStore( state => state.setEnableBot );
    const messages = useChatBotStore( state => state.messages );
    const isTyping = useChatBotStore( state => state.isTyping );
    const setIsTyping = useChatBotStore( state => state.setIsTyping );
    const containerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    return {
        setEnableBot,
        setIsTyping, 
        containerRef,
        messages, 
        isTyping
    }
}

export { useBotWrapperController }