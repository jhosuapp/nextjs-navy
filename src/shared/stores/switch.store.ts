import { create, type StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { SwitchKey } from "../interfaces/switch.interface";

interface SwitchState {
    switches: Record<SwitchKey, boolean>;
}

interface Actions {
    setSwitch: (key: SwitchKey, value: boolean) => void;
    toggleSwitch: (key: SwitchKey) => void;
}

const storeAPI: StateCreator<SwitchState & Actions, [["zustand/devtools", never]]> = (set) => ({
    switches: {
        light_mode: false,
        disable_particles: false,
        gray_contrast: false,
        invert_colors: false,
    },

    setSwitch: (key, value) => set((state) => ({
            switches: {
            ...state.switches,
            [key]: value,
            },
    }), false, `setSwitch/${key}`),

    toggleSwitch: (key) => set((state) => ({
        switches: {
            ...state.switches,
            [key]: !state.switches[key],
        },
    }), false,`toggleSwitch/${key}`),
});

export const useSwitchStore = create<SwitchState & Actions>()(
    persist(
        devtools(storeAPI, { name: "switch-store" }),
        {
            name: 'switch-store'
        }
    )
);
