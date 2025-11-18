import { Continents, RegionsVariants } from "@/shared/interfaces";

import styles from './chipRegions.module.css';

type Props = {
    variant: RegionsVariants;
    continent: Continents;
}

const ChipRegions = ({ variant, continent }:Props):JSX.Element => {
    return (
        <div className={ `${styles.chipRegions} ${styles[`chipRegions${variant}`]}` }>
            <span>
                { continent }
            </span>
        </div>
    )
}

export { ChipRegions }