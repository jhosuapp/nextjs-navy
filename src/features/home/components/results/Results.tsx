import type { JSX } from "react";
import { LoaderSecondary } from "@/shared/components/loader/LoaderSecondary";
import { TestEntry } from "../../interfaces";

import { CardResults } from '../card-results/CardResults';
import { WrapperCarousel } from '../wrapper-carousel/WrapperCarousel';
import { ITranslations } from '@/shared/interfaces/globals';

type Props = {
    hTests: TestEntry[]
    lTests: TestEntry[]
    isLoad: boolean;
    t: ITranslations;
}

const Results = ({ hTests, lTests, isLoad, t }:Props):JSX.Element => {

    return (
        <>
            {isLoad ? (
                <LoaderSecondary 
                    textLoader={ t('feedback.latestHighLoader') }
                    isSmall
                    className="py-5"
                />
            ) : (
                <>
                    <WrapperCarousel reverse>
                        <p className='text-purple-300 text-opacity-50 font-medium text-2xl lg:text-5xl text-nowrap'>{t('results.latestHigh')}</p>
                    </WrapperCarousel>
                    <WrapperCarousel>
                        {hTests?.length && hTests.map((data)=>(
                            <CardResults 
                                nick={ data.nick } 
                                modalitie={ data.game } 
                                modalitieImage={ `${data.game}.webp` as any }
                                showModalitie
                                tier={ data.tier }
                                key={`${data.nick}-results`}
                            />                                        
                        ))}
                    </WrapperCarousel>
                </>
            )}
            {isLoad ? (
                <LoaderSecondary 
                    textLoader={ t('feedback.latestLowLoader') }
                    isSmall
                    className="py-5"
                />
            ) : (
                <>
                    <WrapperCarousel>
                        <p className='text-purple-300 text-opacity-50 font-medium text-2xl lg:text-5xl text-nowrap'>{t('results.latestLow')}</p>
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