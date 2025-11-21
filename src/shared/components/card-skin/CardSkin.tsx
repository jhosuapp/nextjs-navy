import { useSkinStore } from '@/shared/stores';
import { ChipModalities, PropsChipModalities } from '../chip-modalities/ChipModalities';
import { Skin3d } from '../skin-3d/Skin3d';

import styles from './cardSkin.module.css';

type Props = {
    username: string;
    width: number;
    height: number;
    className?: string;
} & PropsChipModalities;

const CardSkin = ({ username, width, height, className = '', modalitie, variant, modalitieImage }:Props):JSX.Element => {
    const setSkin = useSkinStore(state => state.setSkin);
    const skin = useSkinStore(state => state.skin);

    const handleMouseEnter = () => {
        if(skin !== username) setSkin(username);
    };

    return (
        <div className={ `${styles.cardSkin} ${className}` } onMouseEnter={ handleMouseEnter }>
            <div className={ styles.cardSkin__skin }>
                <Skin3d 
                    username={ username } 
                    walk={ false } 
                    width={ width }
                    height={ height }
                />
            </div>
            <ChipModalities modalitie={ modalitie } variant={ variant } modalitieImage={ modalitieImage } />
        </div>
    )
}

export { CardSkin }