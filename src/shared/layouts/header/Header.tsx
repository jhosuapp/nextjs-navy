import Link from 'next/link';
import styles from './header.module.css';
import { HeaderLogo, HeaderLogoText } from './HeaderLogo';
import { HeaderList } from './HeaderList';
import { paths } from '@/shared/constants';
import { useMediaQuery } from '@/shared/hooks';
import { HeaderHamburger } from './HeaderHamburger';
import { useMenuStore } from '@/shared/stores';


const Header = ():JSX.Element => {
    const hamburger = useMenuStore( state => state.hamburger );
    const isDesktop = useMediaQuery({ breakpoint: 1024 });

    return (
        <header className={ `${styles.header} ${hamburger && styles.headerMenuOpen}` }>
            <div className={ styles.header__content }>
                {!isDesktop && ( <HeaderLogoText /> )}
                <nav className={ `${styles.header__nav} ${hamburger && styles.header__navActive}` }>
                    <HeaderList items={[{ text: 'Tierlist', path: paths.tierlist }, { text: 'Staff', path: paths.staff }]} />
                    {isDesktop && <HeaderLogo />}
                    <HeaderList items={[{ text: 'Bans', path: paths.bans }, { text: 'Partners', path: paths.partners }]} />
                </nav>
                {!isDesktop && ( <HeaderHamburger /> )}
            </div>
        </header>
    )
}

export { Header }