import Lenis from "lenis";
import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";

interface LenisState {
    lenis: Lenis | null;
}

interface Actions {
    setLenis: (lenis: Lenis) => void;
}

const storeAPI: StateCreator<LenisState & Actions, [["zustand/devtools", never]]> = (set) =>({
    lenis: null,
    
    setLenis: (value) => set(({
        lenis: value
    }), false, 'setLenis' )
});

export const useLenisStore = create<LenisState & Actions>()(
    devtools(storeAPI, { name: "lenis-store" })
);