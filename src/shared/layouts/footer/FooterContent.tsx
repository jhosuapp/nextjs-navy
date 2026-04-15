import type { JSX } from "react";
import Image from 'next/image';

import styles from './footer.module.css';
import icon from '@/config/assets/svg/icon-arrow.svg';
import { useRouter } from 'next/router';
import { useLenisStore } from '@/shared/stores';
import { ITranslations } from '@/shared/interfaces';


type Props = {
    textPage: string;
    linkPage: string;
    t: ITranslations;
}

const FooterContent = ({ textPage, linkPage, t }:Props):JSX.Element => {
    const router = useRouter();
    const lenis = useLenisStore(state => state.lenis);

    const handleDelay = (url: string) => {
        lenis?.scrollTo(0, {
          duration: 0.65,
        });
      
        setTimeout(() => {
          router.push(url);
        }, 500);
    };

    return (
        <section className={ styles.footerContent }>
            <article className={ styles.footerContent__disclaimer }>
                <p>{t('footer.text1')}</p>
                <p>{t('footer.text2')}</p>
            </article>
            <article className={ styles.footerContent__preview }>
                <p>{ textPage }</p>
                <div 
                    onClick={ ()=> handleDelay(linkPage) }
                    className={ styles.footerContent__nextPage }
                >
                    <p>{t('footer.text3')}</p>
                    <div></div>
                    <Image src={ icon } alt='next Navy' />
                </div>
            </article>
        </section>
    )
}

export { FooterContent }