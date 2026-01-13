import { useModalStore, useSkinStore } from '@/shared/stores';
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
    isHight?: boolean;
    hasTierIndicator?: boolean
} & PropsChipModalities & PropsChipRegions;

const CardSkin = ({ 
    username, 
    width, 
    height, 
    className = '', 
    modalitie, 
    variant, 
    modalitieImage,
    continent,
    tier,
    showUsername = false,
    showRegions = false,
    showModalities = true,
    showModalitie = false,
    isHight = false,
    hasTierIndicator = false,
    direction = null,
}:Props):JSX.Element => {
    const setSkin = useSkinStore(state => state.setSkin);
    const skin = useSkinStore(state => state.skin);
    const setShowModal = useModalStore(state => state.setShowModal);

    const handleMouseEnter = () => {
        if(skin !== username) setSkin(username);
    };

    const hanldeOnClick = () => {
        setShowModal(true);
    };

    return (
        <div className={ `${styles.cardSkin} ${className} ${direction && styles.cardSkin__row}` } onMouseEnter={ handleMouseEnter } onClick={ hanldeOnClick }>
            <div className={ styles.cardSkin__block }>
                <div className={ styles.cardSkin__skin }>
                    <img src={ `https://render.crafty.gg/3d/bust/${username}` } alt={ username } width={ width } height={ height } />
                </div>
                {showUsername && (
                    <p className={ styles.cardSkin__username }>{ username }</p>
                )}
            </div>
            {showRegions && (
                <div className={ styles.cardSkin__flex }>
                    <ChipRegions continent={ continent } />
                    {hasTierIndicator && (
                        <img className={styles.cardSkin__tierIndicator} src={`/images/${isHight ? 'angles' : 'angle'}-up-solid-full.svg`} alt="Tier Navy" />
                    )}
                </div>
            )}
            {showModalities && (
                <ChipModalities modalitie={ modalitie } variant={ variant } modalitieImage={ modalitieImage } tier={ tier } showModalitie={ showModalitie } />
            )}
        </div>
    )
}

export { CardSkin }