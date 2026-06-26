import type { JSX } from "react";
import Image from 'next/image';

import styles from './footer.module.css';
import icon from '@/config/assets/svg/icon-arrow.svg';
import { CustomLink } from '@/shared/components/custom-link/CustomLink';
import { ITranslations } from '@/shared/interfaces/globals';


type Props = {
    textPage: string;
    linkPage: string;
    t: ITranslations;
}

const FooterContent = ({ textPage, linkPage, t }:Props):JSX.Element => {
    return (
        <section className={ styles.footerContent }>
            <article className={ styles.footerContent__disclaimer }>
                <p>{t('footer.text1')}</p>
                <p>{t('footer.text2')}</p>
            </article>
            <article className={ styles.footerContent__preview }>
                <p>{ textPage }</p>
                <CustomLink
                    to={ linkPage }
                    className={ styles.footerContent__nextPage }
                >
                    <p>{t('footer.text3')}</p>
                    <div></div>
                    <Image src={ icon } alt='next Navy' />
                </CustomLink>
            </article>
        </section>
    )
}

export { FooterContent }