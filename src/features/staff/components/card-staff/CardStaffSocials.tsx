import { memo, useEffect, useRef, useState, type JSX } from "react";
import Image from "next/image";
import { ITranslations } from "@/shared/interfaces/globals";
import { namemcUrl, socialUrl } from "@/shared/constants/staffProfile";
import { StaffSocials } from "../../interfaces";

import styles from './cardStaff.module.css';
import iconInstagram from '@/config/assets/svg/icon-instagram.svg';
import iconTiktok from '@/config/assets/svg/icon-tiktok.svg';
import iconYoutube from '@/config/assets/svg/icon-youtube.svg';
import iconTwitch from '@/config/assets/svg/icon-twitch.svg';
import iconX from '@/config/assets/svg/icon-x.svg';
import iconGithub from '@/config/assets/svg/icon-github.svg';
import iconLinkedin from '@/config/assets/svg/icon-linkedin.svg';
import iconDiscord from '@/config/assets/svg/icon-discord.svg';
import iconNamemc from '@/config/assets/svg/icon-nmc.svg';

type Props = {
    socials: StaffSocials;
    namemcNick: string | null;
    nick: string;
    t: ITranslations;
}

const LINKS = [
    { key: 'instagram', icon: iconInstagram },
    { key: 'tiktok', icon: iconTiktok },
    { key: 'youtube', icon: iconYoutube },
    { key: 'twitch', icon: iconTwitch },
    { key: 'x', icon: iconX },
    { key: 'github', icon: iconGithub },
    { key: 'linkedin', icon: iconLinkedin },
] as const;

const COPIED_MS = 2500;

const CardStaffSocials = memo(({ socials, namemcNick, nick, t }: Props): JSX.Element | null => {
    const [copied, setCopied] = useState<boolean>(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }, []);

    const links = LINKS.filter((link) => socials[link.key]);
    const discord = socials.discord_username;

    if (links.length === 0 && !discord && !namemcNick) return null;

    const onCopyDiscord = async () => {
        if (!discord) return;
        try {
            await navigator.clipboard.writeText(discord);
            setCopied(true);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => setCopied(false), COPIED_MS);
        } catch {
            setCopied(false);
        }
    };

    return (
        <ul className={ styles.cardStaff__socials } aria-label={ t('socials.label', { nick }) }>
            {links.map((link) => (
                <li key={ link.key }>
                    <a
                        className={ styles.cardStaff__social }
                        href={ socialUrl(link.key, socials[link.key]!) }
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        aria-label={ `${t(`socials.${link.key}`)} · ${socials[link.key]}` }
                        title={ t(`socials.${link.key}`) }
                    >
                        <Image src={ link.icon } alt="" width={16} height={16} />
                    </a>
                </li>
            ))}
            {namemcNick && (
                <li>
                    <a
                        className={ styles.cardStaff__social }
                        href={ namemcUrl(namemcNick) }
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        aria-label={ t('socials.namemc') }
                        title={ t('socials.namemc') }
                    >
                        <Image src={ iconNamemc } alt="" width={16} height={16} />
                    </a>
                </li>
            )}
            {discord && (
                <li className={ styles.cardStaff__discord }>
                    <button
                        type="button"
                        className={ styles.cardStaff__social }
                        onClick={ onCopyDiscord }
                        aria-label={ `${t('socials.discord')}: ${discord}` }
                    >
                        <Image src={ iconDiscord } alt="" width={16} height={16} />
                    </button>
                    <span className={ `${styles.cardStaff__tooltip} ${copied ? styles.cardStaff__tooltip__visible : ''}` } role="status">
                        { copied ? t('socials.copied') : discord }
                    </span>
                </li>
            )}
        </ul>
    );
});

CardStaffSocials.displayName = 'CardStaffSocials';

export { CardStaffSocials }
