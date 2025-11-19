import { Skin3d } from '../skin-3d/Skin3d';
import styles from './cardSkin.module.css';

type Props = {
    username: string;
    width: number;
    height: number;
}

const CardSkin = ({ username, width, height }:Props):JSX.Element => {
    return (
        <div className={ styles.cardSkin }>
            <div className={ styles.cardSkin__skin }>
                <Skin3d 
                    username={ username } 
                    walk={ false } 
                    width={ width }
                    height={ height }
                />
            </div>
        </div>
    )
}

export { CardSkin }