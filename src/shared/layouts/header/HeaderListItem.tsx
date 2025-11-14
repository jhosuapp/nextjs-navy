import Link from "next/link";

import styles from './header.module.css';
import { useRouter } from "next/router";
import { useMenuStore } from "@/shared/stores";

type Props = {
    text: string;
    path: string;
}

const HeaderListItem = ({ text, path }:Props):JSX.Element => {
    const router = useRouter();
    const isActive = router.pathname === path;
    const setHamburger = useMenuStore( state => state.setHamburger );

    const onClickHamburger = () => {
        setTimeout(()=>{ setHamburger(false) },1000);
    }

    return (
        <li className={`${styles.HeaderListItem} ${isActive ? styles.HeaderListItemActive : ''}`}>
            <Link 
                onClick={ onClickHamburger } 
                href={ path } 
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