import { ChipRegions } from "@/shared/components";
import { CardWrapper } from "../card-wrapper/CardWrapper";

import iconSecondary from '@/config/assets/svg/icon-angle-up-solid-full.svg';
import icon from '@/config/assets/svg/icon-angles-up-solid-full.svg';

const Results = ():JSX.Element => {
    return (
        <>
            <CardWrapper 
                title="HIGH RESULTS" 
                icon={ icon }
                animation={{ delayInit: 0.65, delayEnd: 0.13 }}
            >
                <ChipRegions variant="green" continent="EU" />
                <ChipRegions variant="purple" continent="AS" />
            </CardWrapper>
            <CardWrapper 
                title="LOW RESULTS" 
                icon={ iconSecondary } 
                animation={{ delayInit: 0.67, delayEnd: 0.13 }}
            >
                <ChipRegions variant="orange" continent="SA" />
                <ChipRegions variant="blue" continent="NA" />
            </CardWrapper>
        </>
    )
}

export { Results }