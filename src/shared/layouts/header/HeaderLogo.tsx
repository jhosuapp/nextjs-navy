import Image from "next/image";
import Link from "next/link";

import { paths } from "@/shared/constants"
import { useMenuStore } from "@/shared/stores";
import { useQueryClient } from "@tanstack/react-query";
import { getResumeAction } from "@/features/home/actions";

import styles from './header.module.css';

const HeaderLogo = ():JSX.Element => {
    const queryClient = useQueryClient();
    const setHamburger = useMenuStore( state => state.setHamburger );

    const handlePrefetch = ()=> {
        queryClient.prefetchQuery({
            queryKey: ["resumeHome"],
            queryFn: () => getResumeAction(),
            staleTime: Infinity,
        });
    }

    const onClickHamburger = () => {
        handlePrefetch();
        setTimeout(()=>{ setHamburger(false) },1000);
    }
    
    return (
        <Link 
            href={ paths.home } 
            onClick={ onClickHamburger } 
            onMouseEnter={ handlePrefetch }
            className={ styles.headerLogo }
        >
            <Image
                src="/images/logo.png"
                alt="Logo navy"
                width="128"
                height="128"
                priority
            />
        </Link>
    )
}

const HeaderLogoText = ():JSX.Element => {
    const setHamburger = useMenuStore( state => state.setHamburger );

    const onClickHamburger = () => {
        setTimeout(()=>{ setHamburger(false) },1000);
    }

    return (
        <Link href={ paths.home } onClick={ onClickHamburger } className={ styles.headerLogoText }>
            <span>N</span>
            <span>A</span>
            <span>V</span>
            <span>Y</span>
        </Link>
    )
}

export { HeaderLogo, HeaderLogoText }