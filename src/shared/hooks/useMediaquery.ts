import { useEffect, useState } from "react";

type Props = {
    breakpoint?: number;
    type?: string;
}
  
const useMediaQuery = ({ breakpoint = 1024, type = 'min-width' }:Props) => {
    const [ matches, setMatches ] = useState<boolean>(false);

    useEffect(() => {
        const media = window.matchMedia(`(${type}: ${breakpoint}px)`);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(media.matches);
        window.addEventListener('resize', listener);

        return () => window.removeEventListener('resize', listener);
    }, [breakpoint, matches, type]);

    return matches;
};

export { useMediaQuery }