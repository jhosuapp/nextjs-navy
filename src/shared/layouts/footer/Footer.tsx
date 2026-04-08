import { useTranslation } from "react-i18next";
import { FooterContent } from "./FooterContent";
import { FooterStars } from "./FooterStars";
import { FooterTop } from "./FooterTop";

import styles from './footer.module.css';

type Props = {
    textPage: string;
    linkPage: string;
}

const Footer = ({ textPage, linkPage }:Props):JSX.Element => {
    const { t } = useTranslation("common");

    return (
        <footer className={ styles.footer }>
            <FooterTop 
                t={t}
            />
            <FooterContent
                textPage={ textPage }
                linkPage={ linkPage }
                t={t}
            />
            <FooterStars />
        </footer>
    )
}

export { Footer }