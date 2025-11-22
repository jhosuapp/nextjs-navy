import { ChipModalities, PropsChipModalities } from "@/shared/components";
import styles from './totalTests.module.css';

type Props = {
    count: number;
} & PropsChipModalities;


const TotalTestsItem = ({ modalitie, variant, modalitieImage, count }:Props):JSX.Element => {
    return (
        <div className={ styles.totalTestsItem }>
            <p className={ `${styles.totalTestsItem__modalitie} ${styles[variant]}` }>{ modalitie }</p>
            <div className={ styles.totalTestsItem__block }>
                <p>{ count }</p>
                <ChipModalities modalitie={ modalitie } variant={ variant } modalitieImage={ modalitieImage } />
            </div>
        </div>
    )
}

export { TotalTestsItem }