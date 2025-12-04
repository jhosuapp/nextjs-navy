import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";

interface ModalState {
    showModal: boolean;
}

interface Actions {
    setShowModal: (value: boolean) => void;
}

const storeAPI: StateCreator<ModalState & Actions, [["zustand/devtools", never]]> = (set) =>({
    showModal: false,
    
    setShowModal: (value) => set(({
        showModal: value
    }), false, 'setShowModal' )
});

export const useModalStore = create<ModalState & Actions>()(
    devtools(storeAPI, { name: "modal-store" })
);