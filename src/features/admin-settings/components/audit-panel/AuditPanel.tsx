import { memo, type JSX } from "react";
import { HistoryIcon } from "@/config/assets/icon/admin/AdminIcons";
import { EmptyState, FilterTabs, Pagination, Panel, type FilterTabOption } from "@/features/admin-core/components";
import { Spinner } from "@/shared/components/spinner/Spinner";
import { cn } from "@/shared/helpers/cn";
import { ITranslations } from "@/shared/interfaces/globals";
import { AdminSettingsController } from "../../hooks";
import { AuditFilter } from "../../interfaces";
import { AuditEntryRow } from "./AuditEntryRow";
import styles from "./auditPanel.module.css";

const FILTERS: AuditFilter[] = ["all", "staff", "ban", "user", "system"];

type Props = {
    t: ITranslations;
    locale?: string;
    audit: AdminSettingsController["audit"];
};

const AuditPanel = memo(
    ({ t, locale, audit }: Props): JSX.Element => {
        const options: FilterTabOption<AuditFilter>[] = FILTERS.map((value) => ({
            value,
            label: t(`settings.audit.filter.${value}`),
        }));

        return (
            <Panel title={t("settings.audit.title")} description={t("settings.audit.description")} icon={<HistoryIcon />}>
                <div className={styles.audit__toolbar}>
                    <FilterTabs label={t("common.filterLabel")} options={options} value={audit.filter} onChange={audit.setFilter} />
                </div>

                {audit.isLoading ? (
                    <div className={styles.audit__center}>
                        <Spinner />
                    </div>
                ) : audit.entries.length === 0 ? (
                    <EmptyState text={t("settings.audit.empty")} />
                ) : (
                    <ul className={cn(styles.audit__list, audit.isFetching && styles.audit__fetching)}>
                        {audit.entries.map((entry) => (
                            <AuditEntryRow key={entry.id} t={t} locale={locale} entry={entry} />
                        ))}
                    </ul>
                )}

                <Pagination
                    t={t}
                    page={audit.page}
                    totalPages={audit.totalPages}
                    isFetching={audit.isFetching}
                    onPrev={audit.goToPrevPage}
                    onNext={audit.goToNextPage}
                />
            </Panel>
        );
    }
);

AuditPanel.displayName = "AuditPanel";

export { AuditPanel };
