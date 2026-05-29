import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";

interface LoaderState {
    isLoadingDelay: boolean;
    delayLoading: number;
}

interface Actions {
    setIsLoading: () => void;
}

const storeAPI: StateCreator<LoaderState & Actions, [["zustand/devtools", never]]> = (set, get) =>({
    isLoadingDelay: true,
    delayLoading: 1500,

    setIsLoading: () => {
        setTimeout(() => {
            set({ isLoadingDelay: false }, false, 'setIsLoading');
        }, get().delayLoading);
    }
});

export const useLoaderStore = create<LoaderState & Actions>()(
    devtools(storeAPI, { name: "loader-store" })
);
