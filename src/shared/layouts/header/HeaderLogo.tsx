import type { JSX } from "react";

import { paths } from "@/shared/constants"
import { useMenuStore } from "@/shared/stores/menu.store";
import { CustomLink } from "@/shared/components/custom-link/CustomLink";

import styles from './header.module.css';


const HeaderLogoText = ():JSX.Element => {
    const setHamburger = useMenuStore( state => state.setHamburger );

    const onClickHamburger = () => {
        setTimeout(()=>{ setHamburger(false) },1000);
    }

    return (
        <CustomLink to={ paths.home } onClick={ onClickHamburger } className={ styles.headerLogoText }>
            <span>N</span>
            <span>A</span>
            <span>V</span>
            <span>Y</span>
        </CustomLink>
    )
}

export { HeaderLogoText }
