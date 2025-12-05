import styles from './footer.module.css';

const FooterStars = ():JSX.Element => {
    return (
        <section className={ styles.footerStars }>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </section>
    )
}

export { FooterStars }