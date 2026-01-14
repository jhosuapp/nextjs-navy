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

    const handleSetSwitch = () => {
        setSwitch('dark_mode', !switches[id])
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