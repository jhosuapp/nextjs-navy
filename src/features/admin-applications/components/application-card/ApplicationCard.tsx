import { memo, useState, type JSX } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ITranslations } from "@/shared/interfaces/globals";
import {
    AdminApplication,
    ApplicationKind,
    ApplicationStatus,
} from "../../interfaces";
import styles from "./applicationCard.module.css";

type Props = {
    t: ITranslations;
    data: AdminApplication;
    onUpdateStatus: (
        id: number,
        status: ApplicationStatus,
        kind: ApplicationKind
    ) => void;
    isUpdating: boolean;
};

type TextEntry = { key: string; value: string };
type BoolEntry = { key: string; yes: boolean; detail: string | null };

const STATUS_OPTIONS: ApplicationStatus[] = [
    "pendiente",
    "aceptado",
    "rechazado",
];

const buildEntries = (
    data: AdminApplication
): { textEntries: TextEntry[]; boolEntries: BoolEntry[] } => {
    if (data.kind === "tester") {
        return {
            textEntries: [
                { key: "region", value: data.region },
                { key: "modos", value: data.modos.split(",").join(", ") },
                { key: "tier_modo", value: data.tier_modo },
                { key: "opinion_navy", value: data.opinion_navy },
                { key: "por_que_tester", value: data.por_que_tester },
                { key: "tiempo_testeos", value: data.tiempo_testeos },
                { key: "servidores", value: data.servidores },
                { key: "sospecha_hacks", value: data.sospecha_hacks },
            ],
            boolEntries: [
                {
                    key: "experiencia_tester",
                    yes: data.experiencia_tester,
                    detail: data.detalle_experiencia,
                },
                { key: "baneado", yes: data.baneado, detail: data.detalle_baneado },
                { key: "uso_cheats", yes: data.uso_cheats, detail: null },
                { key: "clanes_pvp", yes: data.clanes_pvp, detail: data.detalle_clanes },
                { key: "toxico", yes: data.toxico, detail: null },
            ],
        };
    }

    return {
        textEntries: [
            { key: "labor_helper", value: data.labor_helper },
            { key: "funciones_helper", value: data.funciones_helper },
            { key: "meta_principal", value: data.meta_principal },
            { key: "opinion_tierlist", value: data.opinion_tierlist },
            { key: "usuarios_peleando", value: data.usuarios_peleando },
            { key: "testers_peleando", value: data.testers_peleando },
            { key: "ticket_tester", value: data.ticket_tester },
            { key: "ticket_reporte", value: data.ticket_reporte },
            { key: "hacks_pvp", value: data.hacks_pvp },
        ],
        boolEntries: [
            { key: "claro_spam", yes: data.claro_spam, detail: data.detalle_spam },
            { key: "claro_flood", yes: data.claro_flood, detail: data.detalle_flood },
            {
                key: "conoce_hacks_ss",
                yes: data.conoce_hacks_ss,
                detail: data.detalle_hacks_ss,
            },
            { key: "tiempo_disciplina", yes: data.tiempo_disciplina, detail: null },
            { key: "capacidad_resolucion", yes: data.capacidad_resolucion, detail: null },
            { key: "se_enoja_facil", yes: data.se_enoja_facil, detail: null },
        ],
    };
};

const formatDate = (iso: string): string =>
    new Date(iso).toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

const ApplicationCard = memo(
    ({ t, data, onUpdateStatus, isUpdating }: Props): JSX.Element => {
        const [open, setOpen] = useState(false);
        const { textEntries, boolEntries } = buildEntries(data);

        return (
            <article className={styles.card}>
                <div className={styles.card__top}>
                    <button
                        type="button"
                        className={styles.card__summary}
                        onClick={() => setOpen((prev) => !prev)}
                        aria-expanded={open}
                    >
                        <div className={styles.card__head}>
                            <div className={styles.card__nameRow}>
                                <span className={styles.card__name}>
                                    {data.nombre}
                                </span>
                                <span
                                    className={`${styles.card__kind} ${
                                        styles[`card__kind__${data.kind}`]
                                    }`}
                                >
                                    {t(`kind.${data.kind}`)}
                                </span>
                            </div>
                            <span className={styles.card__meta}>
                                {data.discord} · {t("card.age", { age: data.edad })}
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

                    <div className={styles.card__status}>
                        <span className={styles.card__statusLabel}>
                            {t("status.label")}
                        </span>
                        <select
                            className={`${styles.card__statusSelect} ${
                                styles[`card__statusSelect__${data.status}`]
                            }`}
                            value={data.status}
                            disabled={isUpdating}
                            onChange={(e) =>
                                onUpdateStatus(
                                    data.id,
                                    e.target.value as ApplicationStatus,
                                    data.kind
                                )
                            }
                        >
                            {STATUS_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                    {t(`status.${option}`)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

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
                                {textEntries.map(({ key, value }) => (
                                    <div className={styles.field} key={key}>
                                        <p className={styles.field__label}>
                                            {t(`fields.${key}`)}
                                        </p>
                                        <p className={styles.field__value}>
                                            {value}
                                        </p>
                                    </div>
                                ))}

                                {boolEntries.map(({ key, yes, detail }) => (
                                    <div className={styles.field} key={key}>
                                        <p className={styles.field__label}>
                                            {t(`fields.${key}`)}
                                        </p>
                                        <p className={styles.field__value}>
                                            {yes ? t("card.yes") : t("card.no")}
                                            {detail ? ` — ${detail}` : ""}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </article>
        );
    }
);

ApplicationCard.displayName = "ApplicationCard";

export { ApplicationCard };
