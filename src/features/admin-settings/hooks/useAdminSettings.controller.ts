import { useMemo, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "next-i18next";
import { useAdminMutation, useUnauthorizedGuard } from "@/features/admin-core/hooks";
import { ITranslations } from "@/shared/interfaces/globals";
import { deleteCacheAction, postPasswordAction, postRevalidateAction } from "../actions";
import { AuditFilter, CacheGroup, CachePurgeBody, RevalidateResult, RevalidateTarget } from "../interfaces";
import { createPasswordSchema, PasswordFormValues } from "../validations/password.validation";
import { ADMIN_AUDIT_KEY, ADMIN_CACHE_KEY, useAuditQuery, useCacheStatsQuery } from "./useAdminSettings.query";

export const REVALIDATE_TARGETS: RevalidateTarget[] = ["home", "staff", "bans"];

/** Revalidación manual de páginas ISR. */
const useRevalidate = (t: ITranslations) => {
    const [lastRun, setLastRun] = useState<{ at: string; results: RevalidateResult[] } | null>(null);

    const mutation = useAdminMutation<RevalidateTarget[], { results: RevalidateResult[] }>({
        mutationFn: postRevalidateAction,
        messages: {
            loading: t("settings.revalidate.loading"),
            success: t("settings.revalidate.success"),
            error: t("settings.revalidate.error"),
        },
        invalidate: [ADMIN_AUDIT_KEY],
        onSuccess: (data) => setLastRun({ at: new Date().toISOString(), results: data.results }),
    });

    return {
        lastRun,
        run: mutation.mutate,
        pendingTargets: mutation.isPending ? mutation.variables : undefined,
    };
};

/** Estadísticas y purga de `api_cache`. */
const useCache = (t: ITranslations) => {
    const statsQuery = useCacheStatsQuery();
    useUnauthorizedGuard(statsQuery.error);
    const [confirming, setConfirming] = useState<CacheGroup | null>(null);

    const mutation = useAdminMutation<CachePurgeBody>({
        mutationFn: deleteCacheAction,
        messages: {
            loading: t("settings.cache.loading"),
            success: t("settings.cache.success"),
            error: t("settings.cache.error"),
        },
        invalidate: [ADMIN_CACHE_KEY, ADMIN_AUDIT_KEY],
        onSuccess: () => setConfirming(null),
    });

    return {
        groups: statsQuery.data?.groups ?? [],
        isLoading: statsQuery.isLoading,
        isFetching: statsQuery.isFetching,
        refresh: () => statsQuery.refetch(),
        confirming,
        askPurge: setConfirming,
        cancelPurge: () => setConfirming(null),
        purgeGroup: (group: CacheGroup) => mutation.mutate({ group }),
        purgeExpired: () => mutation.mutate({ expired: true }),
        isPurging: mutation.isPending,
    };
};

/** Cambio de contraseña del admin actual. */
const usePasswordForm = (t: ITranslations) => {
    const schema = useMemo(
        () =>
            createPasswordSchema({
                required: t("form.required"),
                length: t("form.passwordLength"),
                mismatch: t("form.passwordMismatch"),
                same: t("form.passwordSame"),
            }),
        [t]
    );

    const form = useForm<PasswordFormValues>({
        mode: "onChange",
        resolver: zodResolver(schema) as Resolver<PasswordFormValues>,
        defaultValues: { current: "", next: "", confirm: "" },
    });

    const mutation = useAdminMutation<PasswordFormValues>({
        mutationFn: ({ current, next }) => postPasswordAction({ current, next }),
        messages: {
            loading: t("common.saving"),
            success: t("settings.password.success"),
            error: t("settings.password.error"),
        },
        invalidate: [ADMIN_AUDIT_KEY],
        onSuccess: () => form.reset(),
    });

    return {
        form,
        onSubmit: form.handleSubmit((values) => mutation.mutate(values)),
        isSaving: mutation.isPending,
    };
};

/** Registro de auditoría paginado y filtrable. */
const useAudit = () => {
    const [page, setPage] = useState(1);
    const [filter, setFilterState] = useState<AuditFilter>("all");
    const auditQuery = useAuditQuery(page, filter);
    useUnauthorizedGuard(auditQuery.error);

    const totalPages = auditQuery.data?.totalPages ?? 1;

    return {
        entries: auditQuery.data?.data ?? [],
        total: auditQuery.data?.total ?? 0,
        isLoading: auditQuery.isLoading,
        isFetching: auditQuery.isFetching,
        page,
        totalPages,
        filter,
        setFilter: (next: AuditFilter) => {
            setFilterState(next);
            setPage(1);
        },
        goToNextPage: () => setPage((prev) => Math.min(prev + 1, totalPages)),
        goToPrevPage: () => setPage((prev) => Math.max(prev - 1, 1)),
    };
};

const useAdminSettingsController = () => {
    const { t } = useTranslation("admin");

    return {
        t,
        revalidate: useRevalidate(t),
        cache: useCache(t),
        password: usePasswordForm(t),
        audit: useAudit(),
    };
};

export type AdminSettingsController = ReturnType<typeof useAdminSettingsController>;

export { useAdminSettingsController };
