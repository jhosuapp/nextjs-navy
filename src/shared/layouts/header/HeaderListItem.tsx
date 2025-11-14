import Link from "next/link";

import styles from './header.module.css';
import { useRouter } from "next/router";

type Props = {
    text: string;
    path: string;
}

const HeaderListItem = ({ text, path }:Props):JSX.Element => {
    const router = useRouter();
    const isActive = router.pathname === path;

    return (
        <li className={ `${styles.headerListItem} ${isActive && styles.headerListItemActive}` }>
            <Link href={ path }>{ text }</Link>
        </li>
    )
}

export { HeaderListItem }