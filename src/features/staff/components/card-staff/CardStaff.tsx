import { CardWrapper } from "@/shared/components";
import styles from './cardStaff.module.css';


const CardStaff = ():JSX.Element => {
    return (
        <CardWrapper classNameParent={ styles.cardStaff }>
            <div className={ styles.cardStaff__content }>
                <picture className={ styles.cardStaff__image }>
                    <img src="/images/example.webp" alt="" />
                </picture>
                <div className={ styles.cardStaff__info }>
                    <p>Nombre del staff</p>
                    <span>Rol del staff</span>
                    <small>Updated: 3:48:12 a.m</small>
                </div>
            </div>
        </CardWrapper>
    )
}

export { CardStaff }