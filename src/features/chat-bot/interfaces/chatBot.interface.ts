export interface ItemBotMessage {
    text: string;
    userResponse?: boolean;
    delayMessage?: number;
}

export interface GlobalFuncsForHooks {
    setMessage: (item: ItemBotMessage)=> void;
    setIsTyping: (value: boolean) => void;
    setIsLoad: (value: boolean) => void;
    scrollToBottom?: ()=> void;
}