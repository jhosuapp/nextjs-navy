import { ITranslations } from '@/shared/interfaces';
import styles from './footer.module.css';


type Props = {
    t: ITranslations;
}

const FooterTop = ({ t }:Props):JSX.Element => {
    return (
        <section className={ styles.footerTop }>
            <ul>
                <li>©2026 navy - <a className='hoverLine' href="https://github.com/jhosuapp" target='_blank'>jhosuapp</a></li>
                <li>Discord - <a className='hoverLine' href="https://discord.gg/navyy" target='_blank'>discord.gg.navyy</a></li>
                <li>{t('footer.developedBy')} - <a className='hoverLine' href="https://github.com/jhosuapp" target='_blank'> jhosuapp </a> 💜</li>
            </ul>
        </section>
    )
}

export { FooterTop }