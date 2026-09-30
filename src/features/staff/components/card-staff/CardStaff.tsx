import { memo, type CSSProperties, type JSX } from "react";
import { CardWrapper } from "@/shared/components/card-wrapper/CardWrapper";
import { ITranslations } from "@/shared/interfaces/globals";
import { StaffMember } from "../../interfaces";
import { CardStaffSocials } from "./CardStaffSocials";

import styles from './cardStaff.module.css';

type Props = {
    data: StaffMember;
    isOnline: boolean;
    locale: string;
    t: ITranslations;
}

/** Skin por defecto cuando el miembro no tiene nick. */
const FALLBACK_SKIN = 'MHF_Steve';

// Discord usa #000000 para "sin color": se sustituye por el morado de la web.
const roleTint = (colour: string): string => (colour.toLowerCase() === '#000000' ? '#a855f7' : colour);

const CardStaff = memo(({ data, isOnline, locale, t }: Props): JSX.Element => {
    const nick = data.nick ?? 'N/A';
    const tint = roleTint(data.staff_role_colour);
    const format = new Intl.NumberFormat(locale);
    const isTester = data.tests_total > 0;

    return (
        <CardWrapper classNameParent={ styles.cardStaff } className={ styles.cardStaff__body }>
            <div className={ styles.cardStaff__glow } style={{ '--role-colour': tint } as CSSProperties} aria-hidden="true" />
            <div className={ styles.cardStaff__content }>
                <div className={ styles.cardStaff__avatar }>
                    <picture className={ styles.cardStaff__image }>
                        <img
                            src={ `https://minotar.net/body/${encodeURIComponent(data.nick ?? FALLBACK_SKIN)}/100` }
                            alt={ nick }
                            loading="lazy"
                        />
                    </picture>
                    {isOnline && (
                        <span className={ styles.cardStaff__online } title={ t('online') }>
                            <span className={ styles.cardStaff__online__ping } aria-hidden="true" />
                            <span className="sr-only">{ t('online') }</span>
                        </span>
                    )}
                </div>

                <div className={ styles.cardStaff__info }>
                    <p
                        className={ styles.cardStaff__nick }
                        style={{ backgroundImage: `linear-gradient(to right, ${tint}, white)` }}
                        title={ nick }
                    >
                        { nick }
                    </p>
                    <div className={ styles.cardStaff__badges }>
                        <span className={ styles.cardStaff__role } style={{ color: tint, borderColor: tint }}>
                            { data.staff_role_name }
                        </span>
                        {data.status && (
                            <span className={ `${styles.cardStaff__status} ${styles[`cardStaff__status__${data.status}`]}` }>
                                <span aria-hidden="true" />
                                { t(`status.${data.status}`) }
                            </span>
                        )}
                    </div>
                    <small>{ data.is_premium ? t('premium') : t('noPremium') }</small>
                </div>
            </div>

            {data.bio && <p className={ styles.cardStaff__bio }>{ data.bio }</p>}

            {isTester && (
                <dl className={ styles.cardStaff__stats }>
                    <div>
                        <dt>{ t('stats.month') }</dt>
                        <dd>{ format.format(data.tests_month) }</dd>
                    </div>
                    <div>
                        <dt>{ t('stats.total') }</dt>
                        <dd>{ format.format(data.tests_total) }</dd>
                    </div>
                </dl>
            )}

            <CardStaffSocials
                socials={ data.socials }
                namemcNick={ data.is_premium && data.show_namemc ? data.nick : null }
                nick={ nick }
                t={ t }
            />
        </CardWrapper>
    )
})

CardStaff.displayName = 'CardStaff';

export { CardStaff }
