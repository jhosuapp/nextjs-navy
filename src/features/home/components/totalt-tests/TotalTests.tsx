import { Divider } from '@/shared/components';
import { CardWrapper } from '../card-wrapper/CardWrapper';
import { Title } from '../title/Title';

import styles from './totalTests.module.css';
import icon from '@/config/assets/png/globe.webp';
import Image from 'next/image';
import { TotalTestsItem } from './TotalTestsItem';

const TotalTests = ():JSX.Element => {
    return (
        <CardWrapper animation={{ delayInit: 0.67, delayEnd: 0.13 }}>
            <article className={ styles.totalTests }>
                <div className={ styles.totalTests__hero }>
                    <Title text='Tests totales' />
                    <Image src={ icon } alt='Mundo Navy' />
                </div>
                <Divider />
                <div className={ styles.totalTests__items }>
                    <TotalTestsItem modalitie='Netherite pot' modalitieImage='netherite.webp' variant='purple' count={ 1230 } />
                    <TotalTestsItem modalitie='Crystal' modalitieImage='crystal.webp' variant='pink' count={ 1230 } />
                    <TotalTestsItem modalitie='Sword' modalitieImage='sword.webp' variant='blue' count={ 1230 } />
                </div>
            </article>
        </CardWrapper>
    )
}

export { TotalTests }