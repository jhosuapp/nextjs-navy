import { FooterContent } from "./FooterContent";
import { FooterStars } from "./FooterStars";
import { FooterTop } from "./FooterTop";

import styles from './footer.module.css';

type Props = {
    textPage: string;
    linkPage: string;
}

const Footer = ({ textPage, linkPage }:Props):JSX.Element => {
    return (
        <footer className={ styles.footer }>
            <FooterTop />
            <FooterContent
                textPage={ textPage }
                linkPage={ linkPage }
            />
            <FooterStars />
        </footer>
    )
}

export { Footer }