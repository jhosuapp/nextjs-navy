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
import { useAdminBansController } from "../hooks";
import { BanEditDrawer, BansTable } from "../components";
import { BanStatusFilter } from "../interfaces";
import styles from "./adminBans.module.css";

const STATUSES: BanStatusFilter[] = ["active", "inactive", "hidden"];

const AdminBansView = (): JSX.Element => {
    const { locale } = useRouter();
    const {
        t,
        bans,
        counts,
        isLoading,
        isFetching,
        page,
        totalPages,
        goToNextPage,
        goToPrevPage,
        status,
        setStatus,
        search,
        setSearch,
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
    } = useAdminBansController();

    const filterOptions: FilterTabOption<BanStatusFilter>[] = STATUSES.map((value) => ({
        value,
        label: t(`bans.filter.${value}`),
        count: counts[value],
    }));

    return (
        <>
            <PageHeader title={t("bans.title")} description={t("bans.description")} />

            <div className={styles.toolbar}>
                <FilterTabs label={t("common.filterLabel")} options={filterOptions} value={status} onChange={setStatus} />
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder={t("bans.searchPlaceholder")}
                    clearLabel={t("common.clearSearch")}
                />
            </div>

            <BansTable
                t={t}
                locale={locale}
                bans={bans}
                isLoading={isLoading}
                isFetching={isFetching}
                emptyText={search ? t("common.noResults") : t(`bans.empty.${status}`)}
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

            <BanEditDrawer
                t={t}
                locale={locale}
                ban={editing}
                form={form}
                onSubmit={onSubmitEdit}
                onClose={closeEdit}
                isSaving={isSaving}
            />

            <ConfirmDialog
                isOpen={hiding !== null}
                title={t("bans.hide.title", { id: hiding?.id })}
                description={t("bans.hide.description")}
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

export { AdminBansView };
