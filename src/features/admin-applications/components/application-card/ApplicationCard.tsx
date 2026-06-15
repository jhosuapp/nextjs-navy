import { memo, useState, type JSX } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ITranslations } from "@/shared/interfaces/globals";
import { Application } from "../../interfaces";
import styles from "./applicationCard.module.css";

type Props = {
    t: ITranslations;
    data: Application;
};

const TEXT_FIELDS: Array<keyof Application> = [
    "labor_helper",
    "funciones_helper",
    "meta_principal",
    "opinion_tierlist",
    "usuarios_peleando",
    "testers_peleando",
    "ticket_tester",
    "ticket_reporte",
    "hacks_pvp",
];

const BOOL_FIELDS: Array<{ key: keyof Application; detail?: keyof Application }> = [
    { key: "claro_spam", detail: "detalle_spam" },
    { key: "claro_flood", detail: "detalle_flood" },
    { key: "conoce_hacks_ss", detail: "detalle_hacks_ss" },
    { key: "tiempo_disciplina" },
    { key: "capacidad_resolucion" },
    { key: "se_enoja_facil" },
];

const formatDate = (iso: string): string =>
    new Date(iso).toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

const ApplicationCard = memo(({ t, data }: Props): JSX.Element => {
    const [open, setOpen] = useState(false);

    return (
        <article className={styles.card}>
            <button
                type="button"
                className={styles.card__summary}
                onClick={() => setOpen((prev) => !prev)}
                aria-expanded={open}
            >
                <div className={styles.card__head}>
                    <span className={styles.card__name}>{data.nombre}</span>
                    <span className={styles.card__meta}>
                        {data.correo} · {t("card.age", { age: data.edad })}
                    </span>
                </div>
                <div className={styles.card__aside}>
                    <span className={styles.card__date}>
                        {formatDate(data.created_at)}
                    </span>
                    <span className={styles.card__toggle}>
                        {open ? t("card.collapse") : t("card.expand")}
                    </span>
                </div>
            </button>

            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        className={styles.card__detail}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className={styles.card__detailInner}>
                            {TEXT_FIELDS.map((key) => (
                                <div className={styles.field} key={key}>
                                    <p className={styles.field__label}>
                                        {t(`fields.${key}`)}
                                    </p>
                                    <p className={styles.field__value}>
                                        {String(data[key])}
                                    </p>
                                </div>
                            ))}

                            {BOOL_FIELDS.map(({ key, detail }) => {
                                const yes = data[key] as boolean;
                                const detailValue = detail
                                    ? (data[detail] as string | null)
                                    : null;
                                return (
                                    <div className={styles.field} key={key}>
                                        <p className={styles.field__label}>
                                            {t(`fields.${key}`)}
                                        </p>
                                        <p className={styles.field__value}>
                                            {yes ? t("card.yes") : t("card.no")}
                                            {detailValue ? ` — ${detailValue}` : ""}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </article>
    );
});

ApplicationCard.displayName = "ApplicationCard";

export { ApplicationCard };
