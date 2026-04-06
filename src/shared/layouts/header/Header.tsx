import { useTranslation } from 'react-i18next';
import { HeaderLogo, HeaderLogoText } from './HeaderLogo';
import { HeaderList } from './HeaderList';
import { paths } from '@/shared/constants';
import { useMediaQuery } from '@/shared/hooks';
import { HeaderHamburger } from './HeaderHamburger';
import { useMenuStore } from '@/shared/stores';

import styles from './header.module.css';
import { LanguageSwitcher } from '@/shared/components';


const Header = ():JSX.Element => {
    const { t } = useTranslation("common");
    const hamburger = useMenuStore( state => state.hamburger );
    const isDesktop = useMediaQuery({ breakpoint: 1024 });

    return (
        <header className={ `${styles.header} ${hamburger && styles.headerMenuOpen}` }>
            <div className={ styles.header__content }>
                {!isDesktop && ( <HeaderLogoText /> )}
                <nav className={ `${styles.header__nav} ${hamburger && styles.header__navActive}` }>
                    <HeaderList items={[{ text: t('nav.tierlist'), path: paths.tierlist }, { text: t('nav.staff'), path: paths.staff }]} />
                    {isDesktop && <HeaderLogo />}
                    <HeaderList items={[{ text: t('nav.bans'), path: paths.bans }, { text: t('nav.partners'), path: paths.partners }]} />
                </nav>
                {!isDesktop && ( <HeaderHamburger /> )}
            </div>
            <LanguageSwitcher />
        </header>
    )
}

export { Header }