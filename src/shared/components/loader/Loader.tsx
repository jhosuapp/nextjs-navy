import { useRef } from "react";
import styles from './loader.module.css';

const Loader = ():JSX.Element => {
    const node = useRef<HTMLElement | null>(null);

    setTimeout(()=>{
        node.current && node.current.classList.add(styles.animateLoader);
    },1500);

    return (
        <section className={styles.loader} ref={ node }>
            <article className={styles.loader__bg}></article>
            <article className={`${styles.loader__bg} ${styles.loader__bg__secondary}`}></article>
            <article className={styles.loader__content}>
                <div className={styles.loader__text}>
                    <p style={{ animationDelay: '0.1s' }} className={`text-primary ${styles.navy}`}>N</p>
                    <p style={{ animationDelay: '0.125s' }} className={`text-fifth ${styles.craft}`}>A</p>
                    <p style={{ animationDelay: '0.150s' }} className={`text-primary ${styles.navy}`}>V</p>
                    <p style={{ animationDelay: '0.175s' }} className={`text-fifth ${styles.craft}`}>Y</p>
                    <p style={{ animationDelay: '0.175s' }} className={`text-fifth ${styles.craft}`}>&nbsp;</p>
                    <p style={{ animationDelay: '0.2s' }} className={`text-primary ${styles.navy}`}>P</p>
                    <p style={{ animationDelay: '0.225s' }} className={`text-fifth ${styles.craft}`}>V</p>
                    <p style={{ animationDelay: '0.250s' }} className={`text-primary ${styles.navy}`}>P</p>
                </div>
            </article>
        </section>
    )
}

export { Loader }