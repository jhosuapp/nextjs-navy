import { useEffect, memo, type JSX } from "react";
import { motion } from "framer-motion";
import { variantSwitch } from "./switch.variants";
import { SwitchKey } from "@/shared/interfaces/switch.interface";
import { useSwitchStore } from "@/shared/stores/switch.store";

import styles from './switch.module.css';

type Props = {
    text: string;
    id: SwitchKey;
}

const Switch = memo(({ text, id }:Props):JSX.Element => {
    const switches = useSwitchStore(state => state.switches);
    const setSwitch = useSwitchStore(state => state.setSwitch);

    useEffect(()=>{
        const documentElement = document.documentElement;
        if(documentElement){
            switches[id] ? documentElement.classList.add(id) : documentElement.classList.remove(id);
        }
    },[switches]);

    const handleSetSwitch = () => {
        setSwitch(id, !switches[id]);
        new Audio(switches[id] ? '/mp3/switch-on.mp3' : '/mp3/switch-off.mp3').play();
    }

    return (
        <div className={ styles.switch }>
            <p>{ text } ({switches[id] ? 'on' : 'off'})</p>
            <div className={ styles.switchItem } data-ison={switches[id]} onClick={ handleSetSwitch }>
                <motion.div className={ styles.switchItemHandler } layout transition={ variantSwitch } />
            </div>
        </div>
    )
});

Switch.displayName = 'Switch';

export { Switch }