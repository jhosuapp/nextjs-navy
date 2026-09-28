import type { JSX } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { CardWrappersecondary } from "@/shared/components/card-wrapper-secondary/CardWrapperSecondary";
import { Container } from "@/shared/components/container/Container";
import { fadeUpMotion } from "@/shared/motion/fadeUp.motion";
import { PDP_SECTIONS, TYC_SECTIONS } from "../data";
import { LegalDoc, LegalSection } from "../interfaces";
import styles from "./legal.module.css";

type Props = {
    doc: LegalDoc;
};

const SECTIONS: Record<LegalDoc, LegalSection[]> = {
    tyc: TYC_SECTIONS,
    pdp: PDP_SECTIONS,
};

const range = (length: number): number[] =>
    Array.from({ length }, (_, index) => index + 1);

const LegalView = ({ doc }: Props): JSX.Element => {
    const { t } = useTranslation("legal");
    const sections = SECTIONS[doc];

    return (
        <Container className="!mt-5 lg:!mt-10" isFirst isLast>
            <motion.header className={styles.legalHero} {...fadeUpMotion(0.7, 0.15)}>
                <h1 className={styles.legalHero__title}>{t(`${doc}.title`)}</h1>
                <p className={styles.legalHero__updated}>{t(`${doc}.updated`)}</p>
                <p className={styles.legalHero__intro}>{t(`${doc}.intro`)}</p>
            </motion.header>

            {sections.map((section, index) => (
                <CardWrappersecondary
                    key={section.id}
                    title={t(`${doc}.sections.${section.id}.title`)}
                    text={`${index + 1} / ${sections.length}`}
                    hasAnimation
                >
                    <div className={styles.legalSection}>
                        {range(section.paragraphs).map((n) => (
                            <p className={styles.legalSection__paragraph} key={`p${n}`}>
                                {t(`${doc}.sections.${section.id}.p${n}`)}
                            </p>
                        ))}

                        {section.items ? (
                            <ul className={styles.legalSection__list}>
                                {range(section.items).map((n) => (
                                    <li key={`item${n}`}>
                                        {t(`${doc}.sections.${section.id}.items.item${n}`)}
                                    </li>
                                ))}
                            </ul>
                        ) : null}
                    </div>
                </CardWrappersecondary>
            ))}
        </Container>
    );
};

export { LegalView };
