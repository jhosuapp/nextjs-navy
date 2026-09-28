import { memo, type JSX } from "react";
import { StatusBadge, type BadgeTone } from "@/features/admin-core/components";
import { formatDateTime } from "@/features/admin-core/helpers";
import { ITranslations } from "@/shared/interfaces/globals";
import { getAuditChanges } from "../../helpers";
import { AuditAction, AuditEntry } from "../../interfaces";
import styles from "./auditPanel.module.css";

const ACTION_TONES: Record<AuditAction, BadgeTone> = {
    update: "info",
    hide: "danger",
    restore: "success",
    revalidate: "neutral",
    cache_purge: "warning",
    password_change: "warning",
    status_change: "info",
};

type Props = {
    t: ITranslations;
    locale?: string;
    entry: AuditEntry;
};

const AuditEntryRow = memo(
    ({ t, locale, entry }: Props): JSX.Element => {
        const changes = entry.entity ? getAuditChanges(entry) : [];

        return (
            <li className={styles.audit__entry}>
                <div className={styles.audit__head}>
                    <StatusBadge tone={ACTION_TONES[entry.action] ?? "neutral"}>{t(`settings.audit.actions.${entry.action}`)}</StatusBadge>
                    {entry.entity && (
                        <span className={styles.audit__target}>
                            {t(`settings.audit.entities.${entry.entity}`)} · <code>{entry.entity_key}</code>
                        </span>
                    )}
                    <span className={styles.audit__meta}>
                        {entry.admin_username} · <time dateTime={entry.created_at}>{formatDateTime(entry.created_at, locale)}</time>
                    </span>
                </div>

                {changes.length > 0 && (
                    <ul className={styles.audit__changes}>
                        {changes.map((change) => (
                            <li key={change.field}>
                                <span className={styles.audit__field}>{change.field}</span>
                                <span className={styles.audit__before}>{change.before}</span>
                                <span aria-hidden="true">→</span>
                                <span className="sr-only">{t("settings.audit.to")}</span>
                                <span className={styles.audit__after}>{change.after}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </li>
        );
    }
);

AuditEntryRow.displayName = "AuditEntryRow";

export { AuditEntryRow };
