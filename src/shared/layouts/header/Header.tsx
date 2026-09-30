import { useMemo, type JSX } from 'react';
import { useTranslation } from 'next-i18next';
import { HeaderLogoText } from './HeaderLogo';
import { HeaderList } from './HeaderList';
import { paths } from '@/shared/constants';
import { useMediaQuery } from '@/shared/hooks/useMediaquery';
import { HeaderHamburger } from './HeaderHamburger';
import { HeaderSettings } from './HeaderSettings';
import { useMenuStore } from '@/shared/stores/menu.store';
import { LanguageSwitcher } from '@/shared/components/language-switcher/LanguageSwitcher';
import { getTierlistOverallAction } from '@/features/tierlist/actions/get-tierlistOverall.action';

import styles from './header.module.css';



const Header = ():JSX.Element => {
    const { t } = useTranslation("common");
    const hamburger = useMenuStore( state => state.hamburger );
    const isDesktop = useMediaQuery({ breakpoint: 1024 });
    const navItems = useMemo(() => [
        { text: t('nav.tierlist'),     path: paths.tierlist, prefetchKey: ['tierlist', 'infinite'], action: ()=> getTierlistOverallAction(1) },
        { text: t('nav.staff'),        path: paths.staff },
        { text: t('nav.bans'),         path: paths.bans },
        { text: t('nav.topTesters'),   path: paths.topTesters },
        { text: t('nav.applications'), path: paths.applications }
    ], [t]);

    return (
        <header className={ `${styles.header} ${hamburger && styles.headerMenuOpen}` }>
            <div className={ styles.header__wrapper }>
                <div className={ styles.header__content }>
                    <HeaderLogoText />
                    <nav className={ `${styles.header__nav} ${hamburger && styles.header__navActive}` }>
                        <HeaderList items={ navItems } />
                        {!isDesktop && <HeaderSettings />}
                    </nav>
                    {isDesktop ? (
                        <div className={ styles.header__lang }>
                            <LanguageSwitcher />
                        </div>
                    ) : (
                        <div className={ styles.header__lang__mobile }>
                            <LanguageSwitcher isHeaderOpen={ hamburger } hasMobileStyle />
                            <HeaderHamburger />
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export { Header }
