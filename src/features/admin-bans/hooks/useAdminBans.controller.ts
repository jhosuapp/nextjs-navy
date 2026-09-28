import { useCallback, useState } from "react";
import { useTranslation } from "next-i18next";
import { useAdminMutation, useDebouncedValue, useUnauthorizedGuard } from "@/features/admin-core/hooks";
import { patchBanAction } from "../actions";
import { AdminBan, BanPatchBody, BanStatusFilter } from "../interfaces";
import { BanFormValues } from "../validations/ban-form.validation";
import { ADMIN_BANS_KEY, useAdminBansQuery } from "./useAdminBans.query";
import { toBanPatch, useBanForm } from "./useBanForm";

type PatchVariables = { id: number; body: BanPatchBody };

const useAdminBansController = () => {
    const { t } = useTranslation("admin");
    const [page, setPage] = useState(1);
    const [status, setStatusState] = useState<BanStatusFilter>("active");
    const [search, setSearchState] = useState("");
    const [editing, setEditing] = useState<AdminBan | null>(null);
    const [hiding, setHiding] = useState<AdminBan | null>(null);

    const debouncedSearch = useDebouncedValue(search.trim());
    const bansQuery = useAdminBansQuery(page, status, debouncedSearch);
    useUnauthorizedGuard(bansQuery.error);

    const setStatus = (next: BanStatusFilter) => {
        setStatusState(next);
        setPage(1);
    };

    const setSearch = (value: string) => {
        setSearchState(value);
        setPage(1);
    };

    const form = useBanForm(t, editing);

    const patchMutation = useAdminMutation<PatchVariables>({
        mutationFn: ({ id, body }) => patchBanAction(id, body),
        messages: { loading: t("common.saving"), success: t("common.saved"), error: t("common.saveError") },
        invalidate: [ADMIN_BANS_KEY],
        onSuccess: () => {
            setEditing(null);
            setHiding(null);
        },
    });

    const { mutate } = patchMutation;

    const onSubmitEdit = form.handleSubmit((values: BanFormValues) => {
        if (!editing) return;
        mutate({ id: editing.id, body: toBanPatch(values, editing.original) });
    });

    const onConfirmHide = (reason: string) => {
        if (!hiding) return;
        mutate({ id: hiding.id, body: { hidden: true, hidden_reason: reason || null } });
    };

    const onRestore = useCallback((ban: AdminBan) => mutate({ id: ban.id, body: { hidden: false } }), [mutate]);

    const data = bansQuery.data;
    const totalPages = data?.totalPages ?? 1;

    return {
        t,
        bans: data?.data ?? [],
        counts: data?.counts ?? { active: 0, inactive: 0, hidden: 0 },
        isLoading: bansQuery.isLoading,
        isFetching: bansQuery.isFetching,
        page: data?.page ?? page,
        totalPages,
        goToNextPage: () => setPage((prev) => Math.min(prev + 1, totalPages)),
        goToPrevPage: () => setPage((prev) => Math.max(prev - 1, 1)),
        status,
        setStatus,
        search,
        setSearch,
        editing,
        openEdit: setEditing,
        closeEdit: () => setEditing(null),
        form,
        onSubmitEdit,
        hiding,
        openHide: setHiding,
        closeHide: () => setHiding(null),
        onConfirmHide,
        onRestore,
        isSaving: patchMutation.isPending,
        pendingId: patchMutation.isPending ? patchMutation.variables?.id : undefined,
    };
};

export { useAdminBansController };
