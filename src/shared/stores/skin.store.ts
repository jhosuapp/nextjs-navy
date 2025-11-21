import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";

interface SkinState {
    skin: string;
}

interface Actions {
    setSkin: (value: string) => void;
}

const storeAPI: StateCreator<SkinState & Actions, [["zustand/devtools", never]]> = (set) =>({
    skin: 'yunaez',
    
    setSkin: (value: string) => set(({
        skin: value
    }), false, 'setSkin' )
});

export const useSkinStore = create<SkinState & Actions>()(
    devtools(storeAPI, { name: "skin-store" })
);