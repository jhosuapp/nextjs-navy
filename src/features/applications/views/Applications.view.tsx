import type { JSX } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { Container } from "@/shared/components/container/Container";
import { fadeUpMotion } from "@/shared/motion/fadeUp.motion";
import { ApplicationForm } from "../components/application-form/ApplicationForm";
import styles from "./applications.module.css";

const ApplicationsView = (): JSX.Element => {
    const { t } = useTranslation("applications");

    return (
        <Container className="!mt-5 lg:!mt-10" isFirst isLast>
            <motion.header className={styles.hero} {...fadeUpMotion(0.57, 0)}>
                <h1 className={styles.hero__title}>{t("hero.title")}</h1>
                <p className={styles.hero__description}>{t("hero.description")}</p>
            </motion.header>

            <motion.div {...fadeUpMotion(0.57, 0)}>
                <ApplicationForm t={t} />
            </motion.div>
        </Container>
    );
};

export { ApplicationsView };
