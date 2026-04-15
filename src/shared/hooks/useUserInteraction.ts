import { useEffect, useState } from "react";

const useUserInteraction = (): boolean => {
    const [hasInteracted, setHasInteracted] = useState(false);

    useEffect(() => {
        const handleInteraction = () => {
            setHasInteracted(true);
        };

        window.addEventListener("click", handleInteraction, { once: true });
        window.addEventListener("keydown", handleInteraction, { once: true });

        return () => {
            window.removeEventListener("click", handleInteraction);
            window.removeEventListener("keydown", handleInteraction);
        };
    }, []);

    useEffect(() => {
        if (!hasInteracted) return;
      
        if ((window as any).gtagLoaded) return;
      
        (window as any).gtagLoaded = true;
      
        const script = document.createElement("script");
        script.src = "https://www.googletagmanager.com/gtag/js?id=G-32SX28Q9K2";
      
        document.head.appendChild(script);
      
        window.dataLayer = window.dataLayer || [];
        function gtag(){(window as any).dataLayer.push(arguments);}
        
        // @ts-ignore
        gtag('js', new Date());
        // @ts-ignore
        gtag('config', 'G-32SX28Q9K2');
      
    }, [hasInteracted]);

    return hasInteracted;
};

export { useUserInteraction };