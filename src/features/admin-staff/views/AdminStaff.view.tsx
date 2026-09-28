import type { JSX } from "react";
import { useRouter } from "next/router";
import {
    ConfirmDialog,
    FilterTabs,
    PageHeader,
    SearchInput,
    type FilterTabOption,
} from "@/features/admin-core/components";
import { useAdminStaffController } from "../hooks";
import { StaffEditDrawer, StaffTable } from "../components";
import { StaffVisibilityFilter } from "../interfaces";
import styles from "./adminStaff.module.css";

const AdminStaffView = (): JSX.Element => {
    const { locale } = useRouter();
    const {
        t,
        members,
        counts,
        isLoading,
        isFetching,
        search,
        setSearch,
        visibility,
        setVisibility,
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
    } = useAdminStaffController();

    const filterOptions: FilterTabOption<StaffVisibilityFilter>[] = [
        { value: "visible", label: t("common.filterVisible"), count: counts.visible },
        { value: "hidden", label: t("common.filterHidden"), count: counts.hidden },
    ];

    return (
        <>
            <PageHeader title={t("staff.title")} description={t("staff.description")} />

            <div className={styles.toolbar}>
                <FilterTabs label={t("common.filterLabel")} options={filterOptions} value={visibility} onChange={setVisibility} />
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder={t("staff.searchPlaceholder")}
                    clearLabel={t("common.clearSearch")}
                />
            </div>

            <StaffTable
                t={t}
                members={members}
                isLoading={isLoading}
                isFetching={isFetching}
                emptyText={search ? t("common.noResults") : t(`staff.empty.${visibility}`)}
                pendingId={pendingId}
                onEdit={openEdit}
                onHide={openHide}
                onRestore={onRestore}
            />

            <StaffEditDrawer
                t={t}
                locale={locale}
                member={editing}
                form={form}
                onSubmit={onSubmitEdit}
                onClose={closeEdit}
                isSaving={isSaving}
            />

            <ConfirmDialog
                isOpen={hiding !== null}
                title={t("staff.hide.title", { nick: hiding?.current.nick ?? hiding?.discord_id })}
                description={t("staff.hide.description")}
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

export { AdminStaffView };
