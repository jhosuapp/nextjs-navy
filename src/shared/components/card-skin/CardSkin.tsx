import { useSkinStore } from '@/shared/stores';
import { ChipModalities, PropsChipModalities, ChipRegions, PropsChipRegions } from '../';

import styles from './cardSkin.module.css';

type Props = {
    username: string;
    width: number;
    height: number;
    className?: string;
    showUsername?: boolean; 
    showRegions?: boolean; 
    showModalities?: boolean;
    direction?: 'row' | null;
} & PropsChipModalities & PropsChipRegions;

const CardSkin = ({ 
    username, 
    width, 
    height, 
    className = '', 
    modalitie, 
    variant, 
    modalitieImage,
    variantRegions,
    continent,
    showUsername = false,
    showRegions = false,
    showModalities = true,
    direction = null,
}:Props):JSX.Element => {
    const setSkin = useSkinStore(state => state.setSkin);
    const skin = useSkinStore(state => state.skin);

    const handleMouseEnter = () => {
        if(skin !== username) setSkin(username);
    };

    return (
        <div className={ `${styles.cardSkin} ${className} ${direction && styles.cardSkin__row}` } onMouseEnter={ handleMouseEnter }>
            <div className={ styles.cardSkin__block }>
                <div className={ styles.cardSkin__skin }>
                    <img src={ `https://minotar.net/body/${username}` } alt={ username } width={ width } height={ height } />
                </div>
                {showUsername && (
                    <p className={ styles.cardSkin__username }>{ username }</p>
                )}
            </div>
            {showRegions && (
                <ChipRegions variantRegions={ variantRegions } continent={ continent } />
            )}
            {showModalities && (
                <ChipModalities modalitie={ modalitie } variant={ variant } modalitieImage={ modalitieImage } />
            )}
        </div>
    )
}

export { CardSkin }