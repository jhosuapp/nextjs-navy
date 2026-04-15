import dynamic from "next/dynamic";
import { appWithTranslation } from "next-i18next";
import type { AppProps } from 'next/app';
import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

import Lenis from 'lenis';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useLenisStore, useLoaderStore } from '@/shared/stores';
const ReactQueryDevtools = dynamic(() => import('@tanstack/react-query-devtools').then(mod => mod.ReactQueryDevtools),{ ssr: false });

import './globals.css';
import '@/config/lib/i18n';

function MyApp({ Component, pageProps, router }: AppProps) {
    const setIsLoading = useLoaderStore( state => state.setIsLoading );
    const [queryClient] = useState(() => new QueryClient());
    //Scroll smoth
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
            lerp: 0.1, 
        });
        //Set lenis
        useLenisStore.getState().setLenis(lenis);    
        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        return () => lenis.destroy();
    }, []);

    // Hidde loader 
    useEffect(() => {
        setIsLoading();
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <AnimatePresence mode='wait'>
                <Component key={router.route} {...pageProps} />
            </AnimatePresence>
            {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
    )
}

export default appWithTranslation(MyApp);