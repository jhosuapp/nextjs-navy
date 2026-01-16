import Image from "next/image";
import { CardWrapper } from "@/shared/components";

import styles from './cardPartners.module.css';
import icon from '@/config/assets/svg/icon-youtube.svg';

const CardPartners = ():JSX.Element => {
    return (
        <CardWrapper classNameParent={ styles.cardPartners }>
            <div className={ styles.cardPartners__content }>
                <div className={ styles.cardPartners__image }>
                    <picture>
                        <img src={ `/images/nzcraft.png` } alt={ 'yuna' } />
                    </picture>
                </div>
                <div className={ styles.cardPartners__info }>
                    <h3>Jhosua</h3>
                    <p>Descripción corta partner</p>
                </div>
                <div className={ styles.cardPartners__networks }>
                    <a href="" target="_blank">
                        <Image src={ icon } alt="" />
                    </a>
                    <a href="" target="_blank">
                        <Image src={ icon } alt="" />
                    </a>
                    <a href="" target="_blank">
                        <Image src={ icon } alt="" />
                    </a>
                </div>
            </div>
        </CardWrapper>
    )
}

export { CardPartners }