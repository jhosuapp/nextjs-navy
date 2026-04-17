import type { JSX } from "react"
import { motion } from 'framer-motion';
import { fadeUpMotion } from "@/shared/motion/fadeUp.motion";
import { Button } from "@/shared/components/button/Button";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

import styles from './content.module.css';
import { paths } from "@/shared/constants";

const Content = ():JSX.Element => {
    const router = useRouter();
    const { t } = useTranslation("common");

    const handleRedirect = () => {
        router.push(paths.home);
    }

    return (
        <section className={ styles.content }>
            <h1 className={ styles.content__item }>
                <motion.span {...fadeUpMotion(0.56, 0.13)}>4</motion.span>
                <motion.span {...fadeUpMotion(0.60, 0.12)}>0</motion.span>
                <motion.span {...fadeUpMotion(0.64, 0.11)}>4</motion.span>
            </h1>
            <div className={ styles.content__item }>
                <motion.p {...fadeUpMotion(0.64, 0.11)}>{t('notFound.description1')}</motion.p>
            </div>
            <div className={ styles.content__item }>
                <motion.p {...fadeUpMotion(0.64, 0.11)}>{t('notFound.description2')}</motion.p>
            </div>
            <div className={ `${styles.content__item} ${styles.content__cta}` }>
                <Button
                    onClick={ handleRedirect }
                    text={t('notFound.cta')} 
                    style={'secondary' } 
                    {...fadeUpMotion(0.64, 0.11)}
                />
            </div>
        </section>
    )
}



export { Content }