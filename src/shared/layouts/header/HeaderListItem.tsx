import type { JSX } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQueryClient } from "@tanstack/react-query";
import { useMenuStore } from "@/shared/stores";

import styles from './header.module.css';


type Props = {
    text: string;
    path: string;
    prefetchKey?: string[];
    action?: ()=> void;
}

const HeaderListItem = ({ text, path, prefetchKey = [], action }:Props):JSX.Element => {
    const router = useRouter();
    const isActive = router.pathname === path;
    const setHamburger = useMenuStore( state => state.setHamburger );
    const queryClient = useQueryClient();

    const handlePrefetch = ()=> {
        if (!prefetchKey.length || !action) return;
    
        const isInfinite = prefetchKey.includes('infinite');
        
        if (isInfinite) {
            queryClient.prefetchInfiniteQuery({
                queryKey: prefetchKey,
                queryFn: () => action(),
                staleTime: Infinity,
                initialPageParam: 1,
            });
        } else {
            queryClient.prefetchQuery({
                queryKey: prefetchKey,
                queryFn: () => action(),
                staleTime: Infinity,
            });
        }
    }

    const onClickHamburger = () => {
        handlePrefetch();
        setTimeout(()=>{ setHamburger(false) },1000);
    }

    return (
        <li className={`${styles.HeaderListItem} ${isActive ? styles.HeaderListItemActive : ''}`}>
            <Link 
                onClick={ onClickHamburger } 
                onMouseEnter={ handlePrefetch }
                href={ path } 
                locale={router.locale}
            >
                {text.split('').map((char, index) => (
                    <p
                        key={index}
                        style={{ animationDelay: `${0.1 + index * 0.025}s` }}
                    >
                        {char === ' ' ? '\u00A0' : char}
                    </p>
                ))}
            </Link>
        </li>
    )

}

export { HeaderListItem }