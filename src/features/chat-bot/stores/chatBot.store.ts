import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { ItemBotMessage } from "../interfaces/chatBot.interface";

interface SkinState {
    enableBot: boolean;
    currentStep: number;
    isChatDisabled: boolean;
    isTyping: boolean,
    messages: ItemBotMessage[];
}

interface Actions {
    setEnableBot: (value: boolean) => void;
    setCurrentStep: (value: number) => void;
    setIsChatDisabled: (value: boolean) => void;
    setIsTyping: (value: boolean) => void;
    setMessage: (value: ItemBotMessage) => void;
}

const storeAPI: StateCreator<SkinState & Actions, [["zustand/devtools", never]]> = (set) =>({
    enableBot: false,
    currentStep: 1,
    isChatDisabled: true,
    isTyping: true,
    messages: [{ text: "Hi, im navy bot", delayMessage: 1.5 }, { text: "What do you want?", delayMessage: 3 }],
    
    setEnableBot: (value) => set(({
        enableBot: value
    }), false, 'setEnableBot' ),
    setCurrentStep: (value) => set(({
        currentStep: value
    }), false, 'setCurrentStep' ),
    setIsChatDisabled: (value) => set(({
        isChatDisabled: value
    }), false, 'setIsChatDisabled' ),
    setIsTyping: (value) => set(({
        isTyping: value
    }), false, 'setIsTyping' ),
    setMessage: (value) => set(
        (state) => ({ messages: [...state.messages, value] }), 
    false, 'setMessage'),
});

export const useChatBotStore = create<SkinState & Actions>()(
    devtools(storeAPI, { name: "chat-bot-store" })
);