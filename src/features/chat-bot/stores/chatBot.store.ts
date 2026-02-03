import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";

interface SkinState {
    enableBot: boolean;
}

interface Actions {
    setEnableBot: (value: boolean) => void;
}

const storeAPI: StateCreator<SkinState & Actions, [["zustand/devtools", never]]> = (set) =>({
    enableBot: false,
    
    setEnableBot: (value) => set(({
        enableBot: value
    }), false, 'setEnableBot' )
});

export const useChatBotStore = create<SkinState & Actions>()(
    devtools(storeAPI, { name: "chat-bot-store" })
);