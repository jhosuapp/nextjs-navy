import { Continents, RegionsVariants } from "@/shared/interfaces";

import styles from './chipRegions.module.css';

export type PropsChipRegions = {
    variantRegions?: RegionsVariants;
    continent?: Continents;
}

const ChipRegions = ({ variantRegions, continent }:PropsChipRegions):JSX.Element => {
    return (
        <div className={ `${styles.chipRegions} ${styles[`chipRegions${variantRegions}`]}` }>
            <span>
                { continent }
            </span>
        </div>
    )
}

export { ChipRegions }