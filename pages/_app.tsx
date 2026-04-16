import { appWithTranslation } from "next-i18next";
import type { AppProps } from 'next/app';
import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLoaderStore } from '@/shared/stores/loader.store';
import { useLenisStore } from '@/shared/stores/lenis.store';

import './globals.css';
import '@/config/lib/i18n';

function MyApp({ Component, pageProps, router }: AppProps) {
    const setIsLoading = useLoaderStore( state => state.setIsLoading );
    const [queryClient] = useState(() => new QueryClient());
    //Scroll smoth
    useEffect(() => {
        let lenis: any;
        let rafId: number;
      
        import('lenis').then(({ default: Lenis }) => {
          lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            lerp: 0.1,
          });

          useLenisStore.getState().setLenis(lenis);  
      
          const raf = (time: number) => {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
          };
      
          rafId = requestAnimationFrame(raf);
        });
      
        return () => {
          if (rafId) cancelAnimationFrame(rafId);
          if (lenis) lenis.destroy();
        };
    }, []);

    // Hidde loader 
    useEffect(() => {
        setIsLoading();
    }, [setIsLoading]);

    return (
      <QueryClientProvider client={queryClient}>
          <AnimatePresence mode='wait'>
              <Component key={router.route} {...pageProps} />
          </AnimatePresence>
      </QueryClientProvider>
    )
}

export default appWithTranslation(MyApp);