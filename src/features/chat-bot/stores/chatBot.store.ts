import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { ItemBotMessage } from "../interfaces/chatBot.interface";

interface IUpdateUserNameData {
    isPremium: string;
    uuid: string | number;
    isUuidValid: boolean;
    isUpdated: boolean;
}

interface SkinState {
    enableBot: boolean;
    currentStep: number;
    isTyping: boolean,
    messages: ItemBotMessage[];
    // Field to write
    isChatEnabled: boolean;
    placeholder: string;
    // Custom steps
    updateUserNameData: IUpdateUserNameData;
}

interface Actions {
    setEnableBot: (value: boolean) => void;
    setCurrentStep: (value: number) => void;
    setIsTyping: (value: boolean) => void;
    setMessage: (value: ItemBotMessage) => void;
    // Field to write
    setPlaceholder: (value: string) => void;
    setIsChatEnabled: (value: boolean) => void;
    // Custom steps
    setUpdateUserNameData: (data: Partial<IUpdateUserNameData>) => void;
}

const storeAPI: StateCreator<SkinState & Actions, [["zustand/devtools", never]]> = (set) =>({
    placeholder: '',
    enableBot: false,
    currentStep: 1,
    isTyping: true,
    isChatEnabled: false,
    messages: [{ text: "Hi, im navy bot", delayMessage: 1.5 }, { text: "What do you want?", delayMessage: 3 }],
    updateUserNameData: {
        isPremium: '',
        uuid: '',
        isUuidValid: false,
        isUpdated: false,
    },
    
    setCurrentStep: (value) => set(({
        currentStep: value
    }), false, 'setCurrentStep' ),
    setIsTyping: (value) => set(({
        isTyping: value
    }), false, 'setIsTyping' ),
    setIsChatEnabled: (value) => set(({
        isChatEnabled: value
    }), false, 'setIsChatEnabled' ),
    setMessage: (value) => set(
        (state) => ({ messages: [...state.messages, value] }), 
    false, 'setMessage'),
    // Field to write
    setEnableBot: (value) => set(({
        enableBot: value
    }), false, 'setEnableBot' ),
    setPlaceholder: (value) => set(({
        placeholder: value
    }), false, 'setIsTyping' ),
    // Custom steps
    setUpdateUserNameData: (data) => set(
        (state) => ({
            updateUserNameData: {
                ...state.updateUserNameData,
                ...data
            }
        }),false, 'setUpdateUserNameData'
    ),
});

export const useChatBotStore = create<SkinState & Actions>()(
    devtools(storeAPI, { name: "chat-bot-store" })
);