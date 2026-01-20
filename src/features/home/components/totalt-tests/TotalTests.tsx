import Image from 'next/image';
import { motion } from 'framer-motion';
import { CardWrapper, Divider, LoaderSecondary } from '@/shared/components';
import { Title } from '../title/Title';
import { TotalTestsItem } from './TotalTestsItem';
import { Modalitie } from '@/shared/interfaces';

import styles from './totalTests.module.css';
import icon from '@/config/assets/png/globe.webp';
import { fadeInMotion } from '@/shared/motion';

type Props = {
    totalTests: Record<Modalitie, number>;
    isLoad: boolean;
}

const TotalTests = ({ totalTests, isLoad }:Props):JSX.Element => {
    return (
        <CardWrapper animation={{ delayInit: 0.67, delayEnd: 0.13 }}>
            {isLoad ? (
                <LoaderSecondary
                    textLoader="Loading Total Tests" 
                    isSmall
                    className="py-5"
                />
            ) : (
                <motion.article className={ styles.totalTests } {...fadeInMotion(0,0)}>
                    <div className={ styles.totalTests__hero }>
                        <Title text='total tests' />
                        <Image src={ icon } alt='Mundo Navy' />
                    </div>
                    <Divider />
                    <div className={ styles.totalTests__items }>
                        <TotalTestsItem modalitie='netherite' modalitieImage='netherite.webp' variant='purple' count={ totalTests?.netherite } />
                        <TotalTestsItem modalitie='crystal' modalitieImage='crystal.webp' variant='pink' count={ totalTests?.crystal } />
                        <TotalTestsItem modalitie='sword' modalitieImage='sword.webp' variant='blue' count={ totalTests?.sword } />
                    </div>
                </motion.article>
            )}
        </CardWrapper>
    )
}

export { TotalTests }