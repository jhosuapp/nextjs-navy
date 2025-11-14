import styles from './header.module.css';
import { useMenuStore } from '@/shared/stores';

const HeaderHamburger = ():JSX.Element => {
    const hamburger = useMenuStore( state => state.hamburger );
    const setHamburger = useMenuStore( state => state.setHamburger );

    return (
        <button onClick={ ()=> setHamburger(!hamburger) } className={`${styles.headerHamburger} ${hamburger && styles.headerHamburgerActive}`}>
            <span></span>
            <span></span>
            <span></span>
        </button>
    )
}

export { HeaderHamburger }