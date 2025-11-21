import { CardWrapper } from '../card-wrapper/CardWrapper';
import styles from './totalTests.module.css';

const TotalTests = ():JSX.Element => {
    return (
        <CardWrapper animation={{ delayInit: 0.67, delayEnd: 0.13 }}>
            <article className={ styles.totalTests }>
                <p>hola</p>
            </article>
        </CardWrapper>
    )
}

export { TotalTests }