import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";

interface LoaderState {
    isLoading: boolean;
    isLoadingDelay: boolean;
    delayLoading: number;
}

interface Actions {
    setIsLoading: () => void;
}

const storeAPI: StateCreator<LoaderState & Actions, [["zustand/devtools", never]]> = (set, get) =>({
    isLoading: true,
    isLoadingDelay: true,
    delayLoading: 2000,
    
    setIsLoading: () => {
        const delay = get().delayLoading;

        setTimeout(() => {
          set({ isLoading: false }, false, 'setIsLoading');
        }, delay); 

        setTimeout(() => {
          set({ isLoadingDelay: false }, false, 'setIsLoading');
        }, delay + 1500); 
    }
});

export const useLoaderStore = create<LoaderState & Actions>()(
    devtools(storeAPI, { name: "loader-store" })
);