import { useCallback, useEffect, useMemo, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "next-i18next";
import { useAdminMutation, useDebouncedValue, useUnauthorizedGuard } from "@/features/admin-core/hooks";
import { patchUserAction } from "../actions";
import { AdminUser, UserPatchBody, UserStatusFilter } from "../interfaces";
import { createUserFormSchema, UserFormValues } from "../validations/user-form.validation";
import { ADMIN_USERS_KEY, useAdminUsersQuery } from "./useAdminUsers.query";

type PatchVariables = { key: string; body: UserPatchBody };

const useAdminUsersController = () => {
    const { t } = useTranslation("admin");
    const [page, setPage] = useState(1);
    const [status, setStatusState] = useState<UserStatusFilter>("visible");
    const [search, setSearchState] = useState("");
    const [editing, setEditing] = useState<AdminUser | null>(null);
    const [hiding, setHiding] = useState<AdminUser | null>(null);

    const debouncedSearch = useDebouncedValue(search.trim());
    const usersQuery = useAdminUsersQuery(page, status, debouncedSearch);
    useUnauthorizedGuard(usersQuery.error);

    const setStatus = (next: UserStatusFilter) => {
        setStatusState(next);
        setPage(1);
    };

    const setSearch = (value: string) => {
        setSearchState(value);
        setPage(1);
    };

    const schema = useMemo(() => createUserFormSchema(t("form.nick")), [t]);
    const form = useForm<UserFormValues>({
        mode: "onChange",
        resolver: zodResolver(schema) as Resolver<UserFormValues>,
        defaultValues: { nick: "" },
    });

    const { reset } = form;
    useEffect(() => {
        if (editing) reset({ nick: editing.nick });
    }, [editing, reset]);

    const patchMutation = useAdminMutation<PatchVariables>({
        mutationFn: ({ key, body }) => patchUserAction(key, body),
        messages: { loading: t("common.saving"), success: t("common.saved"), error: t("common.saveError") },
        invalidate: [ADMIN_USERS_KEY],
        onSuccess: () => {
            setEditing(null);
            setHiding(null);
        },
    });

    const { mutate } = patchMutation;

    const onSubmitEdit = form.handleSubmit(({ nick }: UserFormValues) => {
        if (!editing) return;
        const value = nick.trim();
        // Vacío o igual al nick del bot = quitar el override.
        mutate({ key: editing.key, body: { nick: value === "" || value === editing.original_nick ? null : value } });
    });

    const onConfirmHide = (reason: string) => {
        if (!hiding) return;
        mutate({ key: hiding.key, body: { hidden: true, hidden_reason: reason || null } });
    };

    const onRestore = useCallback((user: AdminUser) => mutate({ key: user.key, body: { hidden: false } }), [mutate]);

    const data = usersQuery.data;
    const totalPages = data?.totalPages ?? 1;

    return {
        t,
        users: data?.data ?? [],
        counts: data?.counts ?? { visible: 0, hidden: 0 },
        isLoading: usersQuery.isLoading,
        isFetching: usersQuery.isFetching,
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
        pendingKey: patchMutation.isPending ? patchMutation.variables?.key : undefined,
    };
};

export { useAdminUsersController };
