import { motion } from 'framer-motion';
import { CardSkin, CardWrapper, LoaderSecondary } from "@/shared/components";
import { Chip } from "../chip/Chip";
import { TestEntry } from "../../interfaces";

import iconSecondary from '@/config/assets/svg/icon-angle-up-solid-full.svg';
import icon from '@/config/assets/svg/icon-angles-up-solid-full.svg';
import { fadeInMotion } from '@/shared/motion';

type Props = {
    hTests: TestEntry[]
    lTests: TestEntry[]
    isLoad: boolean;
}

const Results = ({ hTests, lTests, isLoad }:Props):JSX.Element => {

    return (
        <>
            <CardWrapper
                title="HIGH RESULTS" 
                icon={ icon }
                animation={{ delayInit: 0.65, delayEnd: 0.13 }}
                className="flex flex-col gap-4"
            >
                <Chip text="Latest publications" />
                {isLoad ? (
                    <LoaderSecondary 
                        textLoader="Loading High Results" 
                        isSmall
                        className="py-5"
                    />
                ) : (
                    <motion.div className="flex flex-col gap-4" {...fadeInMotion(0,0)}>
                        {hTests?.length && hTests.map((data, index)=>(
                            <CardSkin 
                                username={ data.nick } 
                                width={ 50 } 
                                height={ 150 } 
                                modalitie={ data.game } 
                                continent={ data.region }
                                direction='row'
                                modalitieImage={ `${data.game}.webp` as any }
                                showUsername
                                showRegions
                                showModalitie
                                tier={ data.tier }
                                key={`${data.nick}-${index}`}
                            />
                        ))}
                    </motion.div>
                )}
            </CardWrapper>
            <CardWrapper 
                title="LOW RESULTS" 
                icon={ iconSecondary } 
                animation={{ delayInit: 0.67, delayEnd: 0.13 }}
                className="flex flex-col gap-4"
            >
                <Chip text="Latest publications" />
                {isLoad ? (
                    <LoaderSecondary 
                        textLoader="Loading High Results" 
                        isSmall
                        className="py-5"
                    />
                ) : (
                    <motion.div className="flex flex-col gap-4" {...fadeInMotion(0,0)}>
                        {lTests?.length && lTests.map((data, index)=>(
                            <CardSkin 
                                username={ data.nick } 
                                width={ 50 } 
                                height={ 150 } 
                                modalitie={ data.game } 
                                continent={ data.region }
                                direction='row'
                                modalitieImage={ `${data.game}.webp` as any }
                                showUsername
                                showRegions
                                showModalitie
                                tier={ data.tier }
                                key={`${data.nick}-${index}`}
                            />
                        ))}
                    </motion.div>
                )}
            </CardWrapper>
        </>
    )
}

export { Results }