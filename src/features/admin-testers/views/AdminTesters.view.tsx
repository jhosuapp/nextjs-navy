import type { JSX } from "react";
import { useRouter } from "next/router";
import {
    ConfirmDialog,
    FilterTabs,
    PageHeader,
    Pagination,
    SearchInput,
    type FilterTabOption,
} from "@/features/admin-core/components";
import { useAdminTestersController } from "../hooks";
import { TesterEditDialog, TestersTable } from "../components";
import { TesterFilter } from "../interfaces";
import styles from "./adminTesters.module.css";

const AdminTestersView = (): JSX.Element => {
    const { locale } = useRouter();
    const {
        t,
        testers,
        counts,
        isLoading,
        isFetching,
        search,
        setSearch,
        filter,
        setFilter,
        page,
        totalPages,
        goToPrevPage,
        goToNextPage,
        editing,
        openEdit,
        closeEdit,
        form,
        onSubmitEdit,
        hiding,
        openHide,
        closeHide,
        onConfirmHide,
        onRestore,
        isSaving,
        pendingId,
    } = useAdminTestersController();

    const filterOptions: FilterTabOption<TesterFilter>[] = [
        { value: "visible", label: t("testers.filter.visible"), count: counts.visible },
        { value: "unnamed", label: t("testers.filter.unnamed"), count: counts.unnamed },
        { value: "hidden", label: t("testers.filter.hidden"), count: counts.hidden },
    ];

    return (
        <>
            <PageHeader title={t("testers.title")} description={t("testers.description")} />

            <div className={styles.toolbar}>
                <FilterTabs label={t("common.filterLabel")} options={filterOptions} value={filter} onChange={setFilter} />
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder={t("testers.searchPlaceholder")}
                    clearLabel={t("common.clearSearch")}
                />
            </div>

            <TestersTable
                t={t}
                testers={testers}
                locale={locale}
                isLoading={isLoading}
                isFetching={isFetching}
                emptyText={search ? t("common.noResults") : t(`testers.empty.${filter}`)}
                pendingId={pendingId}
                onEdit={openEdit}
                onHide={openHide}
                onRestore={onRestore}
            />

            <Pagination
                t={t}
                page={page}
                totalPages={totalPages}
                isFetching={isFetching}
                onPrev={goToPrevPage}
                onNext={goToNextPage}
            />

            <TesterEditDialog
                t={t}
                tester={editing}
                form={form}
                onSubmit={onSubmitEdit}
                onClose={closeEdit}
                isSaving={isSaving}
            />

            <ConfirmDialog
                isOpen={hiding !== null}
                title={t("testers.hide.title", { nick: hiding?.nick ?? hiding?.discord_id })}
                description={t("testers.hide.description")}
                confirmLabel={t("common.hide")}
                cancelLabel={t("common.cancel")}
                closeLabel={t("common.close")}
                reasonLabel={t("common.hiddenReason")}
                reasonPlaceholder={t("common.hiddenReasonPlaceholder")}
                isLoading={isSaving}
                onConfirm={onConfirmHide}
                onCancel={closeHide}
            />
        </>
    );
};

export { AdminTestersView };
