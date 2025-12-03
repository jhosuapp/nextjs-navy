import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { Modalitie } from "../interfaces";

interface ModalitiesState {
    currentModalitie: Modalitie;
}

interface Actions {
    setCurrentModalitie: (value: Modalitie) => void;
}

const storeAPI: StateCreator<ModalitiesState & Actions, [["zustand/devtools", never]]> = (set) =>({
    currentModalitie: 'Overall',
    
    setCurrentModalitie: (value) => set(({
        currentModalitie: value
    }), false, 'setCurrentModalitie' )
});

export const useModalitieStore = create<ModalitiesState & Actions>()(
    devtools(storeAPI, { name: "modalitie-store" })
);