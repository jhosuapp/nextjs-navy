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
                    <p style={{ animationDelay: '0.1s' }} className={`text-primary ${styles.blot}`}>N</p>
                    <p style={{ animationDelay: '0.125s' }} className={`text-primary ${styles.blot}`}>A</p>
                    <p style={{ animationDelay: '0.275s' }} className={`text-fifth ${styles.craft}`}>V</p>
                    <p style={{ animationDelay: '0.3s' }} className={`text-fifth ${styles.craft}`}>Y</p>
                </div>
            </article>
        </section>
    )
}

export { Loader }