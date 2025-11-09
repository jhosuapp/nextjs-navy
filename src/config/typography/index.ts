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
});

export const minecraft = localFont({
    src: [
        {
            path: './fonts/Minecrafter.Reg.ttf',
            weight: '400',
        },
    ],
    variable: '--font-minecraft',
});

export const blockletter = localFont({
    src: [
        {
            path: './fonts/Blockletter.otf',
            weight: '400',
        },
    ],
    variable: '--font-block',
});

export const aeonik = localFont({
    src: [
        {
            path: './fonts/Aeonik-Regular.woff2',
            weight: '400',
        },
        {
            path: './fonts/Aeonik-Medium.woff2',
            weight: '500',
        },
    ],
    variable: '--font-aeonik',
});