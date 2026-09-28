import type { JSX } from "react";
import { motion } from "framer-motion";
import { Spinner } from "@/shared/components/spinner/Spinner";
import {
    EmptyState,
    FilterTabs,
    PageHeader,
    Pagination,
    type FilterTabOption,
} from "@/features/admin-core/components";
import { useAdminApplicationsController } from "../hooks";
import { ApplicationCard } from "../components/application-card/ApplicationCard";
import { ApplicationKindFilter } from "../interfaces";
import styles from "./adminApplications.module.css";

const FILTERS: ApplicationKindFilter[] = ["all", "helper", "tester"];

const AdminApplicationsView = (): JSX.Element => {
    const {
        t,
        applications,
        total,
        page,
        totalPages,
        isListLoading,
        isListFetching,
        goToNextPage,
        goToPrevPage,
        kind,
        setKind,
        onUpdateStatus,
        updatingKey,
    } = useAdminApplicationsController();

    const filterOptions: FilterTabOption<ApplicationKindFilter>[] = FILTERS.map((option) => ({
        value: option,
        label: t(`filter.${option}`),
    }));

    return (
        <>
            <PageHeader title={t("list.title")} description={t("list.subtitle", { total })} />

            <div className={styles.toolbar}>
                <FilterTabs label={t("filter.label")} options={filterOptions} value={kind} onChange={setKind} />
            </div>

            {isListLoading ? (
                <div className={styles.center}>
                    <Spinner />
                </div>
            ) : applications.length === 0 ? (
                <EmptyState text={t("list.empty")} />
            ) : (
                <>
                    <div className={styles.list}>
                        {applications.map((application) => (
                            <motion.div layout key={`${application.kind}-${application.id}`}>
                                <ApplicationCard
                                    t={t}
                                    data={application}
                                    onUpdateStatus={onUpdateStatus}
                                    isUpdating={updatingKey === `${application.kind}-${application.id}`}
                                />
                            </motion.div>
                        ))}
                    </div>

                    <Pagination
                        t={t}
                        page={page}
                        totalPages={totalPages}
                        isFetching={isListFetching}
                        onPrev={goToPrevPage}
                        onNext={goToNextPage}
                    />
                </>
            )}
        </>
    );
};

export { AdminApplicationsView };
