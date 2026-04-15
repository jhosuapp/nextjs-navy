import type { JSX } from "react";
import { Continents, REGION_VARIANT_BY_CONTINENT } from "@/shared/interfaces";

import styles from './chipRegions.module.css';


export type PropsChipRegions = {
    continent?: Continents
}

const ChipRegions = ({ continent }:PropsChipRegions):JSX.Element => {
    const variant = REGION_VARIANT_BY_CONTINENT[continent ?? 'AS'];

    return (
        <div className={ `${styles.chipRegions} ${styles[`chipRegions${variant}`]}` }>
            <span>
                { continent }
            </span>
        </div>
    )
}

export { ChipRegions }