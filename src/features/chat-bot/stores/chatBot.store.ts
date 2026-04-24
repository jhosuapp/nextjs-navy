import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { ItemBotMessage } from "../interfaces/chatBot.interface";

type ImessagesSave = 'uuid' | '';

interface IUpdateUserNameData {
    isPremium: string;
    isUpdated: boolean;
}

interface ChatBotState {
    enableBot: boolean;
    currentStep: number;
    isTyping: boolean;
    isLoad: boolean;
    messages: ItemBotMessage[];
    reloadInitialOptions: {
        delay: number;
        enabled: boolean;
        reload: boolean;
    }
    // Field to write
    isChatEnabled: boolean;
    atrFieldAnswer: { name: ImessagesSave; placeholder: string; };
    messagesSaved: Record<ImessagesSave, string>;
    errorInMessage: string;
    // Custom steps
    updateUserNameData: IUpdateUserNameData;
}

interface Actions {
    setEnableBot: (value: boolean) => void;
    setCurrentStep: (value: number) => void;
    setIsTyping: (value: boolean) => void;
    setIsLoad: (value: boolean) => void;
    setMessage: (value: ItemBotMessage) => void;
    setReloadInitialOptions: (value: { delay: number; enabled: boolean; reload: boolean }) => void;
    // Field to write
    setAtrFieldAnswer: (value: { name: ImessagesSave, placeholder: string }) => void;
    setIsChatEnabled: (value: boolean) => void;
    setMessagesSaved: (value: Partial<Record<ImessagesSave, string>>) => void;
    setErrorInMessage: (value: string) => void;
    // Custom steps
    setUpdateUserNameData: (data: Partial<IUpdateUserNameData>) => void;
    // Reset bot
    setResetBot: (override?: Partial<ChatBotState>) => void;
}

const getInitialState = (): ChatBotState => ({
    atrFieldAnswer: { name: '', placeholder: '' },
    enableBot: false,
    isLoad: false,
    currentStep: 1,
    isTyping: true,
    reloadInitialOptions: {
        delay: 0,
        enabled: false,
        reload: false
    },
    isChatEnabled: false,
    errorInMessage: '',
    messages: [{ text: "Hi, im navy bot", delayMessage: 1.5 }, { text: "What do you want?", delayMessage: 3 }],
    messagesSaved: { uuid: '', '': '' },
    updateUserNameData: {
        isPremium: '',
        isUpdated: false,
    },
});

const storeAPI: StateCreator<ChatBotState & Actions, [["zustand/devtools", never]]> = (set) =>({
    ...getInitialState(),
    
    setCurrentStep: (value) => set(({
        currentStep: value
    }), false, 'setCurrentStep' ),
    setIsTyping: (value) => set(({
        isTyping: value
    }), false, 'setIsTyping' ),
    setIsLoad: (value) => set(({
        isLoad: value
    }), false, 'setIsLoad' ),
    setIsChatEnabled: (value) => set(({
        isChatEnabled: value
    }), false, 'setIsChatEnabled' ),
    setMessage: (value) => set(
        (state) => ({ messages: [...state.messages, value] }), 
    false, 'setMessage'),
    setReloadInitialOptions: (value) => set(({
        reloadInitialOptions: value
    }), false, 'setEnableBot' ),
    // Field to write
    setEnableBot: (value) => set(({
        enableBot: value
    }), false, 'setEnableBot' ),
    setAtrFieldAnswer: (value) => set(({
        atrFieldAnswer: { name: value.name, placeholder: value.placeholder }
    }), false, 'setAtrFieldAnswer' ),
    setErrorInMessage: (value) => set(({
        errorInMessage: value
    }), false, 'setAtrFieldAnswer' ),
    setMessagesSaved: (data) => set(
        (state) => ({
            messagesSaved: {
                ...state.messagesSaved,
                ...data
            }
        }),false, 'setMessagesSaved'
    ),
    // Custom steps
    setUpdateUserNameData: (data) => set(
        (state) => ({
            updateUserNameData: {
                ...state.updateUserNameData,
                ...data
            }
        }),false, 'setUpdateUserNameData'
    ),
    // Reset bot
    setResetBot: (override) => set(
        () => ({
            ...getInitialState(),
            ...override
        }), false, 'setResetBot'
    ),
});

export const useChatBotStore = create<ChatBotState & Actions>()(
    devtools(storeAPI, { name: "chat-bot-store" })
);