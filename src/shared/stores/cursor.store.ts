import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";

interface CursorState {
    coords: { clientX: number, clientY: number };
}

interface Actions {
    setCoords: (value: { clientX: number, clientY: number }) => void;
}

const storeAPI: StateCreator<CursorState & Actions, [["zustand/devtools", never]]> = (set) =>({
    coords: { clientX: 0, clientY: 0 },
    
    setCoords: (value) => set(({
        coords: value
    }), false, 'setCoords' )
});

export const useCursorStore = create<CursorState & Actions>()(
    devtools(storeAPI, { name: "cursor-store" })
);