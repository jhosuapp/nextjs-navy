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
    const setReloadInitialOptions = useChatBotStore(state => state.setReloadInitialOptions);
    const reloadInitialOptions = useChatBotStore(state => state.reloadInitialOptions);
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
        if (!messages || messages.length === 0) return;
    
        scrollToBottom();
    
        const timeouts: ReturnType<typeof setTimeout>[] = [];
    
        messages.forEach((msg) => {
            const delay = ((msg.delayMessage ?? 0) * 1000) + 100;
            const t = setTimeout(() => {
                scrollToBottom();
            }, delay);
            timeouts.push(t);
        });
    
        return () => {
            timeouts.forEach(clearTimeout);
        };
    
    }, [messages, isTyping, isLoad, reloadInitialOptions]);

    useEffect(()=>{
        if(!useChatBotStore.getState().isTyping){
            setResetBot();
        }
    },[router.route, setResetBot]);

    useEffect(() => {
        if (reloadInitialOptions.enabled && reloadInitialOptions.delay) {
            setReloadInitialOptions({ ...reloadInitialOptions, delay: 0 });
            setIsTyping(true);
            const newMessage = {
                text: 'Do you need anything else?',
                delayMessage: reloadInitialOptions.delay
            };
            setMessage(newMessage);
        }

        if (reloadInitialOptions.reload) {
            setResetBot({
                enableBot: true,
                isTyping: false,
                messages: [],
            });
        }
    }, [reloadInitialOptions.enabled, reloadInitialOptions.reload, reloadInitialOptions.delay]);

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