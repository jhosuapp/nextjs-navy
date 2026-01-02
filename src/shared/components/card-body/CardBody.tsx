import { ReactNode } from 'react';
import styles from './cardBody.module.css';

type Props = {
    username: string;
    children?: ReactNode;
}

const CardBody = ({ username, children }:Props):JSX.Element => {
    return (
        <div className={ styles.tierDataOverallItem__skin }>
            <div className={ styles.tierDataOverallItem__skin__item }>
                <img src={ `https://render.crafty.gg/3d/bust/${username}` } alt={ username } />
            </div>
            <div>
                <p>{ username }</p>
                { children }
            </div>
        </div>
    )
}

export { CardBody }