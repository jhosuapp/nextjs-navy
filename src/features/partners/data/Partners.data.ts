import { PartnersItem } from "../interface";
import iconYoutube from '@/config/assets/svg/icon-youtube.svg';
import iconTiktok from '@/config/assets/svg/icon-tiktok.svg';
import iconDiscord from '@/config/assets/svg/icon-discord.svg';
import iconCube from '@/config/assets/svg/icon-cube.svg';
import iconNc from '@/config/assets/svg/icon-nmc.svg';

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
            {
                href: 'https://discord.gg/nzcraft',
                src: iconCube,
                alt: 'Nzcraft',
                hasTooltip: true
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
            {
                href: 'https://discord.gg/nzcraft',
                src: iconCube,
                alt: 'Zenith',
                hasTooltip: true
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
            {
                href: 'https://es.namemc.com/profile/06ec3577-3299-45fa-bbdf-613b1f86c8ab',
                src: iconNc,
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
            {
                href: 'https://es.namemc.com/profile/06ec3577-3299-45fa-bbdf-613b1f86c8ab',
                src: iconNc,
                alt: 'YunaEz'
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
            {
                href: 'https://es.namemc.com/profile/06ec3577-3299-45fa-bbdf-613b1f86c8ab',
                src: iconNc,
                alt: 'YunaEz'
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
            {
                href: 'https://es.namemc.com/profile/06ec3577-3299-45fa-bbdf-613b1f86c8ab',
                src: iconNc,
                alt: 'YunaEz'
            },
        ]
    },
]