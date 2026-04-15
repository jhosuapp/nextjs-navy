import localFont from 'next/font/local';

export const roboto = localFont({
    src: [
        {
            path: './fonts/Roboto_Condensed-Light.woff2',
            weight: '400',
        },
        {
            path: './fonts/Roboto_Condensed-Medium.woff2',
            weight: '500',
        },
        {
            path: './fonts/Roboto_Condensed-Bold.woff2',
            weight: '700',
        },
    ],
    variable: '--font-roboto',
    display: 'swap',
    preload: true
});