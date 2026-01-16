import Image from "next/image";
import { CardWrapper } from "@/shared/components";

import styles from './cardPartners.module.css';
import { PartnersItem } from "../../interface";

type Props = {
    data: PartnersItem
}

const CardPartners = ({ data }:Props):JSX.Element => {
    return (
        <CardWrapper classNameParent={ styles.cardPartners }>
            <div className={ styles.cardPartners__content }>
                <div className={ styles.cardPartners__image }>
                    <picture>
                        <img src={ data.img } alt={ 'yuna' } />
                    </picture>
                </div>
                <div className={ styles.cardPartners__info }>
                    <h3>{ data.name }</h3>
                    <p>{ data.description }</p>
                </div>
                <div className={ styles.cardPartners__networks }>
                    {data.networks.map((network)=>(
                        <a href={ network.href } target="_blank">
                            <Image src={ network.src } alt={ network.alt } />
                        </a>
                    ))}
                </div>
            </div>
        </CardWrapper>
    )
}

export { CardPartners }