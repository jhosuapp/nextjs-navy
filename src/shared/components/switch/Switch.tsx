import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { variantSwitch } from "./switch.variants";
import { SwitchKey } from "@/shared/interfaces";
import { useSwitchStore } from "@/shared/stores";

import styles from './switch.module.css';

type Props = {
    text: string;
    id: SwitchKey;
}

const Switch = React.memo(({ text, id }:Props):JSX.Element => {
    const switches = useSwitchStore(state => state.switches);
    const setSwitch = useSwitchStore(state => state.setSwitch);

    useEffect(()=>{
        const body = document.body;
        if(body){
            switches[id] ? body.classList.add(id) : body.classList.remove(id);
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

export { Switch }