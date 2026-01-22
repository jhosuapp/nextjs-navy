import { motion } from 'framer-motion';
import { CardSkin, CardWrapper, LoaderSecondary } from "@/shared/components";
import { Chip } from "../chip/Chip";
import { TestEntry } from "../../interfaces";

import iconSecondary from '@/config/assets/svg/icon-angle-up-solid-full.svg';
import icon from '@/config/assets/svg/icon-angles-up-solid-full.svg';
import { fadeInMotion } from '@/shared/motion';
import { CardResults } from '../card-results/CardResults';
import { WrapperCarousel } from '../wrapper-carousel/WrapperCarousel';

type Props = {
    hTests: TestEntry[]
    lTests: TestEntry[]
    isLoad: boolean;
}

const Results = ({ hTests, lTests, isLoad }:Props):JSX.Element => {

    return (
        <>
            {isLoad ? (
                <LoaderSecondary 
                    textLoader="Loading High Results" 
                    isSmall
                    className="py-5"
                />
            ) : (
                <>
                    <WrapperCarousel reverse>
                        <p className='text-purple-300 text-opacity-50 font-medium text-2xl lg:text-5xl text-nowrap'>LATEST HIGH RESULTS * LATEST HIGH RESULTS * LATEST HIGH RESULTS * LATEST HIGH RESULTS * LATEST HIGH RESULTS * LATEST HIGH RESULTS * LATEST HIGH RESULTS * LATEST HIGH RESULTS * LATEST HIGH RESULTS</p>
                    </WrapperCarousel>
                    <WrapperCarousel>
                        {hTests?.length && hTests.map((data, index)=>(
                            <CardResults 
                                nick={ data.nick } 
                                modalitie={ data.game } 
                                modalitieImage={ `${data.game}.webp` as any }
                                showModalitie
                                tier={ data.tier }
                                key={`${data.nick}-${index}`}
                            />                                        
                        ))}
                    </WrapperCarousel>
                </>
            )}
            {isLoad ? (
                <LoaderSecondary 
                    textLoader="Loading High Results" 
                    isSmall
                    className="py-5"
                />
            ) : (
                <>
                    <WrapperCarousel>
                        <p className='text-purple-300 text-opacity-50 font-medium text-2xl lg:text-5xl text-nowrap'>LATEST LOW RESULTS * LATEST LOW RESULTS * LATEST LOW RESULTS * LATEST LOW RESULTS * LATEST LOW RESULTS * LATEST LOW RESULTS * LATEST LOW RESULTS * LATEST LOW RESULTS * LATEST LOW RESULTS * LATEST LOW RESULTS * LATEST LOW RESULTS * LATEST LOW RESULTS * LATEST LOW RESULTS * LATEST LOW RESULTS * LATEST LOW RESULTS * LATEST LOW RESULTS * LATEST LOW RESULTS * LATEST LOW RESULTS * LATEST LOW RESULTS * LATEST LOW RESULTS * LATEST LOW RESULTS</p>
                    </WrapperCarousel>
                    <WrapperCarousel reverse>
                        {lTests?.length && lTests.map((data, index)=>(
                            <CardResults 
                                nick={ data.nick } 
                                modalitie={ data.game } 
                                modalitieImage={ `${data.game}.webp` as any }
                                showModalitie
                                tier={ data.tier }
                                key={`${data.nick}-${index}`}
                            />     
                        ))}
                    </WrapperCarousel>
                </>
            )}
        </>
    )
}

export { Results }