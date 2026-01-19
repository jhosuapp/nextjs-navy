import { PartnersItem } from "../interface";
import iconYoutube from '@/config/assets/svg/icon-youtube.svg';
import iconTiktok from '@/config/assets/svg/icon-tiktok.svg';
import iconDiscord from '@/config/assets/svg/icon-discord.svg';
import iconInstagram from '@/config/assets/svg/icon-instagram.svg';

export const serversData:PartnersItem[] = [
    {
        name: 'Nzcraft',
        description: 'Servidor pvp 1.9',
        img: '/images/nzcraft.png',
        networks: [
            {
                href: 'https://www.youtube.com/@nzcraftnetwork3605',
                src: iconYoutube,
                alt: 'Nzcraft'
            },
            {
                href: 'https://www.tiktok.com/@nzcraftserver',
                src: iconTiktok,
                alt: 'Nzcraft'
            },
            {
                href: 'https://discord.gg/nzcraft',
                src: iconDiscord,
                alt: 'Nzcraft'
            },
        ]
    },
    {
        name: 'Zenith',
        description: 'Servidor pvp 1.9',
        img: '/images/zenith.webp',
        networks: [
            {
                href: 'https://www.youtube.com/@ElysiumSN',
                src: iconYoutube,
                alt: 'Zenith'
            },
            {
                href: 'https://www.tiktok.com/@elysiumsn',
                src: iconTiktok,
                alt: 'Zenith'
            },
            {
                href: 'https://discord.gg/HAyCwqzRn5',
                src: iconDiscord,
                alt: 'Zenith'
            },
        ]
    },
]

export const streamersData:PartnersItem[] = [
  
    {
        name: 'YunaEz',
        description: 'Streamer',
        img: '/images/yunaez.webp',
        networks: [
            {
                href: 'https://www.tiktok.com/@yunaez0',
                src: iconTiktok,
                alt: 'YunaEz'
            },
        ]
    },
    {
        name: 'ValeriaEz',
        description: 'Streamer',
        img: '/images/valeriaez.webp',
        networks: [
            {
                href: 'https://www.tiktok.com/@.valeria.ez',
                src: iconTiktok,
                alt: 'ValeriaEz'
            },
        ]
    },
    {
        name: 'Toallero',
        description: 'Streamer',
        img: '/images/toallero.webp',
        networks: [
            {
                href: 'https://www.tiktok.com/@to4llero',
                src: iconTiktok,
                alt: 'Toallero'
            },
        ]
    },
    {
        name: 'Fabe09_',
        description: 'Streamer',
        img: '/images/fabe.webp',
        networks: [
            {
                href: 'https://www.tiktok.com/@fabe09_',
                src: iconTiktok,
                alt: 'Fabe09_'
            },
        ]
    },
]