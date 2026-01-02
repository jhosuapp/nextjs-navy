import { CardWrapper } from "@/shared/components";
import { StaffMember } from "../../interfaces";

import styles from './cardStaff.module.css';

type Props = {
    data: StaffMember;
}

const CardStaff = ({ data }:Props):JSX.Element => {
    return (
        <CardWrapper classNameParent={ styles.cardStaff }>
            <div className={ styles.cardStaff__content }>
                <picture className={ styles.cardStaff__image }>
                    <img src={ `https://minotar.net/body/${data.nick}` } alt={ data.nick } />
                </picture>
                <div className={ styles.cardStaff__info }>
                    <p
                        style={{
                            backgroundImage: `linear-gradient(to right, ${data.staff_role_colour}, white)`
                        }}
                    >
                        { data.nick ?? 'N/A' }
                    </p>
                    <span>{data.staff_role_name}</span>
                    <small>{ data.is_premium ? `Premium` : 'No premium' }</small>
                </div>
            </div>
        </CardWrapper>
    )
}

export { CardStaff }