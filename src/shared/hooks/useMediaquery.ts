import { useEffect, useState } from "react";

type Props = {
    breakpoint?: number;
    type?: string;
}
  
const useMediaQuery = ({ breakpoint = 1024, type = 'min-width' }:Props) => {
    const [ matches, setMatches ] = useState<boolean>(false);

    useEffect(() => {
        const media = window.matchMedia(`(${type}: ${breakpoint}px)`);
    
        const listener = () => {
            setMatches(media.matches);
        };
    
        listener();
    
        media.addEventListener('change', listener);
    
        return () => {
            media.removeEventListener('change', listener);
        };
    }, [breakpoint, type]);

    return matches;
};

export { useMediaQuery }