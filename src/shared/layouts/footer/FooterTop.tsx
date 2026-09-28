import type { JSX } from "react";
import { CustomLink } from '@/shared/components/custom-link/CustomLink';
import { paths } from '@/shared/constants';
import { ITranslations } from '@/shared/interfaces/globals';
import styles from './footer.module.css';


type Props = {
    t: ITranslations;
}

const FooterTop = ({ t }:Props):JSX.Element => {
    return (
        <section className={ styles.footerTop }>
            <ul>
                <li>©2026 navy - <a className='hoverLine' href="https://github.com/jhosuapp" target='_blank'>jhosuapp</a></li>
                <li className={ styles.footerTop__legal }>
                    <CustomLink to={ paths.tyc } className='hoverLine'>{t('footer.terms')}</CustomLink>
                    <span aria-hidden="true">·</span>
                    <CustomLink to={ paths.pdp } className='hoverLine'>{t('footer.privacy')}</CustomLink>
                </li>
                <li>{t('footer.developedBy')} - <a className='hoverLine' href="https://github.com/jhosuapp" target='_blank'> jhosuapp </a> 💜</li>
            </ul>
        </section>
    )
}

export { FooterTop }
