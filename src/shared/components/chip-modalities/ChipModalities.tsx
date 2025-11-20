import { Modalitie, ModalitieImage, ModalitiesVariants } from "@/shared/interfaces";
import styles from './chipModalities.module.css';

export type PropsChipModalities = {
    variant: ModalitiesVariants;
    modalitie: Modalitie;
    modalitieImage: ModalitieImage;
}

const ChipModalities = ({ variant, modalitie, modalitieImage }:PropsChipModalities):JSX.Element => {
    return (
        <div className={ `${styles.chipModalities} ${styles[`chipModalities${variant}`]}` }>
            <div className={ styles.chipModalities__image }>
                <img src={`/images/${modalitieImage}`} alt="icono navy" />
            </div>
        </div>
    )
}

export { ChipModalities }