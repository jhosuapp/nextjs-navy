import localFont from 'next/font/local';

export const roboto = localFont({
    src: [
        {
            path: './fonts/Roboto_Condensed-Light.ttf',
            weight: '400',
        },
        {
            path: './fonts/Roboto_Condensed-Medium.ttf',
            weight: '500',
        },
        {
            path: './fonts/Roboto_Condensed-Bold.ttf',
            weight: '700',
        },
    ],
    variable: '--font-roboto',
    display: 'swap',
    preload: true
});

export const minecraft = localFont({
    src: [
        {
            path: './fonts/Minecrafter.Reg.ttf',
            weight: '400',
        },
    ],
    variable: '--font-minecraft',
    display: 'optional',
});