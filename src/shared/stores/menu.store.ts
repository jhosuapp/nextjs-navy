import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";

interface MenuState {
    hamburger: boolean;
}

interface Actions {
    setHamburger: (value: boolean) => void;
}

const storeAPI: StateCreator<MenuState & Actions, [["zustand/devtools", never]]> = (set) =>({
    hamburger: false,
    
    setHamburger: (value: boolean) => set(({
        hamburger: value
    }), false, 'setHamburger' )
});

export const useMenuStore = create<MenuState & Actions>()(
    devtools(storeAPI, { name: "menu-store" })
);