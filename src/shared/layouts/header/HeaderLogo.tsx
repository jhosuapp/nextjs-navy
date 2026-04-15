import Image from "next/image";
import Link from "next/link";

import { paths } from "@/shared/constants"
import { useMenuStore } from "@/shared/stores";

import styles from './header.module.css';

const HeaderLogo = ():JSX.Element => {
    const setHamburger = useMenuStore( state => state.setHamburger );

    const onClickHamburger = () => {
        setTimeout(()=>{ setHamburger(false) },1000);
    }
    
    return (
        <Link href={ paths.home } onClick={ onClickHamburger } className={ styles.headerLogo }>
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
            <span className="text-purple-300 text-opacity-50">N</span>
            <span className="text-purple-300 text-opacity-50">A</span>
            <span className="text-purple-300 text-opacity-50">V</span>
            <span className="text-purple-300 text-opacity-50">Y</span>
        </Link>
    )
}

export { HeaderLogo, HeaderLogoText }