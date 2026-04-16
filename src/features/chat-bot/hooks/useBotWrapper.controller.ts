import { useEffect, useRef } from 'react';
import { useChatBotStore } from '../stores/chatBot.store';
import { useUserNameController } from './useUserName.controller';
import { useRouter } from 'next/router';

const useBotWrapperController = () => {
    const messages = useChatBotStore( state => state.messages );
    const isTyping = useChatBotStore( state => state.isTyping );
    const isLoad = useChatBotStore( state => state.isLoad );
    const setIsTyping = useChatBotStore( state => state.setIsTyping );
    const setIsLoad = useChatBotStore( state => state.setIsLoad );
    const setResetBot = useChatBotStore( state => state.setResetBot );
    const errorInMessage = useChatBotStore( state => state.errorInMessage );
    const setMessage = useChatBotStore( state => state.setMessage );
    const setErrorInMessage = useChatBotStore( state => state.setErrorInMessage );
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

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

    const { } = useUserNameController({ setMessage, setIsTyping, setIsLoad, scrollToBottom });

    useEffect(()=>{
        if(errorInMessage !== ''){
            setTimeout(()=>{
                setErrorInMessage('')
            },5000);
        }
    },[errorInMessage, setErrorInMessage]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, isLoad]);

    useEffect(()=>{
        if(!useChatBotStore.getState().isTyping){
            setResetBot();
        }
    },[router.route, setResetBot]);

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