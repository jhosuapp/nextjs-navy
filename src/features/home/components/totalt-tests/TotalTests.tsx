import { motion } from 'framer-motion';
import { LoaderSecondary } from '@/shared/components';
import { Modalitie } from '@/shared/interfaces';

import styles from './totalTests.module.css';
import { fadeInMotion } from '@/shared/motion';
import { AnimatedCounter } from '../counter/Counter';

type Props = {
    totalTests: Record<Modalitie, number>;
    isLoad: boolean;
}

const TotalTests = ({ totalTests, isLoad }:Props):JSX.Element => {
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
                        label={ 'Sword Tests' }
                        index={1}
                        modalitie='sword'
                        modalitieImage='sword.webp'
                    />
                    <AnimatedCounter
                        value={ totalTests.netherite }
                        label={ 'Netherite Tests' }
                        index={0.5}
                        modalitie='netherite'
                        modalitieImage='netherite.webp'
                    />
                    <AnimatedCounter
                        value={ totalTests.crystal }
                        label={ 'Crystal Tests' }
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