import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { useTranslation } from "next-i18next";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAdminMutation, useUnauthorizedGuard } from "@/features/admin-core/hooks";
import { ADMIN_PAGE_SIZE } from "@/shared/constants/admin";
import { patchTesterAction } from "../actions";
import { AdminTester, TesterFilter, TesterPatchBody } from "../interfaces";
import { createTesterFormSchema, TesterFormValues } from "../validations/tester-form.validation";
import { ADMIN_TESTERS_KEY, useAdminTestersQuery } from "./useAdminTesters.query";

type PatchVariables = { discordId: string; body: TesterPatchBody };

const matchesFilter = (tester: AdminTester, filter: TesterFilter): boolean => {
    if (filter === "hidden") return tester.hidden;
    if (tester.hidden) return false;
    return filter === "unnamed" ? tester.nick === null : true;
};

const matchesSearch = (tester: AdminTester, needle: string): boolean =>
    !needle ||
    [tester.nick, tester.base_nick, tester.discord_id, tester.role_name].some((value) =>
        value?.toLowerCase().includes(needle)
    );

const useAdminTestersController = () => {
    const { t } = useTranslation("admin");
    const [search, setSearchState] = useState("");
    const [filter, setFilterState] = useState<TesterFilter>("visible");
    const [page, setPage] = useState(1);
    const [editing, setEditing] = useState<AdminTester | null>(null);
    const [hiding, setHiding] = useState<AdminTester | null>(null);

    const testersQuery = useAdminTestersQuery();
    useUnauthorizedGuard(testersQuery.error);

    const deferredSearch = useDeferredValue(search.trim().toLowerCase());
    const testers = useMemo(() => testersQuery.data?.data ?? [], [testersQuery.data]);

    const counts = useMemo(
        () => ({
            visible: testers.filter((tester) => matchesFilter(tester, "visible")).length,
            unnamed: testers.filter((tester) => matchesFilter(tester, "unnamed")).length,
            hidden: testers.filter((tester) => matchesFilter(tester, "hidden")).length,
        }),
        [testers]
    );

    const filtered = useMemo(
        () => testers.filter((tester) => matchesFilter(tester, filter) && matchesSearch(tester, deferredSearch)),
        [testers, filter, deferredSearch]
    );

    const totalPages = Math.max(1, Math.ceil(filtered.length / ADMIN_PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const rows = filtered.slice((currentPage - 1) * ADMIN_PAGE_SIZE, currentPage * ADMIN_PAGE_SIZE);

    const setSearch = useCallback((value: string) => {
        setSearchState(value);
        setPage(1);
    }, []);

    const setFilter = useCallback((value: TesterFilter) => {
        setFilterState(value);
        setPage(1);
    }, []);

    const schema = useMemo(() => createTesterFormSchema(t("form.nick")), [t]);
    const form = useForm<TesterFormValues>({
        mode: "onChange",
        resolver: zodResolver(schema) as Resolver<TesterFormValues>,
        defaultValues: { nick: "" },
    });

    const { reset } = form;
    useEffect(() => {
        if (editing) reset({ nick: editing.nick ?? "" });
    }, [editing, reset]);

    const patchMutation = useAdminMutation<PatchVariables>({
        mutationFn: ({ discordId, body }) => patchTesterAction(discordId, body),
        messages: { loading: t("common.saving"), success: t("common.saved"), error: t("common.saveError") },
        invalidate: [ADMIN_TESTERS_KEY],
        onSuccess: () => {
            setEditing(null);
            setHiding(null);
        },
    });

    const { mutate } = patchMutation;

    // Vacío o igual al nick que ya resuelve la web = quitar el override.
    const onSubmitEdit = form.handleSubmit((values: TesterFormValues) => {
        if (!editing) return;
        const nick = values.nick.trim();
        mutate({
            discordId: editing.discord_id,
            body: { nick: nick === "" || nick === editing.base_nick ? null : nick },
        });
    });

    const onConfirmHide = (reason: string) => {
        if (!hiding) return;
        mutate({ discordId: hiding.discord_id, body: { hidden: true, hidden_reason: reason || null } });
    };

    const onRestore = useCallback(
        (tester: AdminTester) => mutate({ discordId: tester.discord_id, body: { hidden: false } }),
        [mutate]
    );

    return {
        t,
        testers: rows,
        counts,
        isLoading: testersQuery.isLoading,
        isFetching: testersQuery.isFetching,
        search,
        setSearch,
        filter,
        setFilter,
        page: currentPage,
        totalPages,
        goToPrevPage: () => setPage((value) => Math.max(1, value - 1)),
        goToNextPage: () => setPage((value) => Math.min(totalPages, value + 1)),
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
        pendingId: patchMutation.isPending ? patchMutation.variables?.discordId : undefined,
    };
};

export { useAdminTestersController };
