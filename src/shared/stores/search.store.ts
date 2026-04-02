import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";

interface SearchState {
    value: string;
}

interface Actions {
    setValue: (value: string) => void;
}

const storeAPI: StateCreator<SearchState & Actions, [["zustand/devtools", never]]> = (set) =>({
    value: '',
    
    setValue: (value) => set(({
        value: value
    }), false, 'setValueSearch' )
});

export const useSearchStore = create<SearchState & Actions>()(
    devtools(storeAPI, { name: "search-store" })
);