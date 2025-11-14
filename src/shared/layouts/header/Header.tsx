import Link from 'next/link';
import styles from './header.module.css';
import { HeaderLogo } from './HeaderLogo';
import { HeaderList } from './HeaderList';
import { paths } from '@/shared/constants';


const Header = ():JSX.Element => {
    return (
        <header className={ styles.header }>
            <div className={ styles.header__content }>
                <nav className={ styles.header__nav }>
                    <HeaderList items={[{ text: 'Tierlist', path: paths.tierlist }, { text: 'Staff', path: paths.staff }]} />
                    <HeaderLogo />
                    <HeaderList items={[{ text: 'Bans', path: paths.bans }, { text: 'Partners', path: paths.partners }]} />
                </nav>
            </div>
        </header>
    )
}

export { Header }