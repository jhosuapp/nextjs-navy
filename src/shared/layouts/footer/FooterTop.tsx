import styles from './footer.module.css';


const FooterTop = ( ):JSX.Element => {
    return (
        <section className={ styles.footerTop }>
            <ul>
                <li>©2024 navy - <a className='hoverLine' href="https://github.com/jhosuapp" target='_blank'>jhosuapp</a></li>
                <li>Discord - <a className='hoverLine' href="https://discord.gg/navyy" target='_blank'>discord.gg.navyy</a></li>
                <li>Desarrollado por - <a className='hoverLine' href="https://github.com/jhosuapp" target='_blank'> jhosuapp </a> 💜</li>
            </ul>
        </section>
    )
}

export { FooterTop }