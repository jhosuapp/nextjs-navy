import { Divider } from '@/shared/components';
import { CardWrapper } from '../card-wrapper/CardWrapper';
import styles from './totalTests.module.css';
import { Title } from '../title/Title';

const TotalTests = ():JSX.Element => {
    return (
        <CardWrapper animation={{ delayInit: 0.67, delayEnd: 0.13 }}>
            <article className={ styles.totalTests }>
                <Title text='Tests totales' />
                <Divider />
            </article>
        </CardWrapper>
    )
}

export { TotalTests }