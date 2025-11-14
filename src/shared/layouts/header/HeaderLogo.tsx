import Image from "next/image";
import Link from "next/link";

import { paths } from "@/shared/constants"
import logo from '@/config/assets/png/logo.webp';
import styles from './header.module.css';

const HeaderLogo = ():JSX.Element => {
    return (
        <Link href={ paths.home } className={ styles.headerLogo }>
            <Image src={ logo } alt='Logo navy' />
        </Link>
    )
}

export { HeaderLogo }