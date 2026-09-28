import type { JSX } from "react";
import {
    ConfirmDialog,
    FilterTabs,
    PageHeader,
    Pagination,
    SearchInput,
    type FilterTabOption,
} from "@/features/admin-core/components";
import { useAdminUsersController } from "../hooks";
import { UserEditDialog, UsersTable } from "../components";
import { UserStatusFilter } from "../interfaces";
import styles from "./adminUsers.module.css";

const AdminUsersView = (): JSX.Element => {
    const {
        t,
        users,
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
        pendingKey,
    } = useAdminUsersController();

    const filterOptions: FilterTabOption<UserStatusFilter>[] = [
        { value: "visible", label: t("users.filter.visible"), count: counts.visible },
        { value: "hidden", label: t("users.filter.hidden"), count: counts.hidden },
    ];

    return (
        <>
            <PageHeader title={t("users.title")} description={t("users.description")} />

            <div className={styles.toolbar}>
                <FilterTabs label={t("common.filterLabel")} options={filterOptions} value={status} onChange={setStatus} />
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder={t("users.searchPlaceholder")}
                    clearLabel={t("common.clearSearch")}
                />
            </div>

            <UsersTable
                t={t}
                users={users}
                isLoading={isLoading}
                isFetching={isFetching}
                emptyText={search ? t("common.noResults") : t(`users.empty.${status}`)}
                pendingKey={pendingKey}
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

            <UserEditDialog
                t={t}
                user={editing}
                form={form}
                onSubmit={onSubmitEdit}
                onClose={closeEdit}
                isSaving={isSaving}
            />

            <ConfirmDialog
                isOpen={hiding !== null}
                title={t("users.hide.title", { nick: hiding?.nick })}
                description={t("users.hide.description")}
                confirmLabel={t("users.hideAction")}
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

export { AdminUsersView };
