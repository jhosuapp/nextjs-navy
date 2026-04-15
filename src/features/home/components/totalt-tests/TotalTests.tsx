import type { JSX } from "react";
import { motion } from 'framer-motion';
import { LoaderSecondary } from '@/shared/components/loader/LoaderSecondary';
import { ITranslations } from '@/shared/interfaces/globals';
import { Modalitie } from '@/shared/interfaces/modalities.interface';
import { fadeInMotion } from '@/shared/motion/fadeIn.motion';
import { AnimatedCounter } from '../counter/Counter';

import styles from './totalTests.module.css';

type Props = {
    totalTests: Record<Modalitie, number>;
    isLoad: boolean;
    t: ITranslations;
}

const TotalTests = ({ totalTests, isLoad, t }:Props):JSX.Element => {
    return (
        <>
            {isLoad ? (
                <LoaderSecondary
                    textLoader="Loading Total Tests" 
                    isSmall
                    className="py-5"
                />
            ) : (
                <motion.article className={ styles.totalTests } {...fadeInMotion(0,0)}>
                    <AnimatedCounter
                        value={ totalTests.sword }
                        label={ t('resume.swordTests') }
                        index={1}
                        modalitie='sword'
                        modalitieImage='sword.webp'
                    />
                    <AnimatedCounter
                        value={ totalTests.netherite }
                        label={ t('resume.netheriteTests') }
                        index={0.5}
                        modalitie='netherite'
                        modalitieImage='netherite.webp'
                    />
                    <AnimatedCounter
                        value={ totalTests.crystal }
                        label={ t('resume.crystalTests') }
                        index={0}
                        modalitie='crystal'
                        modalitieImage='crystal.webp'
                    />
                </motion.article>
            )}
        </>
    )
}

export { TotalTests }