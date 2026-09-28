import { useState } from "react";
import { useTranslation } from "next-i18next";
import { useAdminMutation, useUnauthorizedGuard } from "@/features/admin-core/hooks";
import { patchApplicationStatusAction } from "../actions";
import {
    ApplicationKind,
    ApplicationKindFilter,
    ApplicationStatus,
} from "../interfaces";
import { useApplicationsQuery } from "./useAdminApplications.query";

type StatusVariables = {
    id: number;
    status: ApplicationStatus;
    kind: ApplicationKind;
};

const useAdminApplicationsController = () => {
    const { t } = useTranslation("admin");
    const [page, setPage] = useState(1);
    const [kind, setKindState] = useState<ApplicationKindFilter>("all");

    const setKind = (next: ApplicationKindFilter) => {
        setKindState(next);
        setPage(1);
    };

    const applicationsQuery = useApplicationsQuery(page, kind);
    useUnauthorizedGuard(applicationsQuery.error);

    const statusMutation = useAdminMutation<StatusVariables>({
        mutationFn: ({ id, status, kind: itemKind }) =>
            patchApplicationStatusAction(id, { status, kind: itemKind }),
        messages: {
            loading: t("status.loading"),
            success: t("status.updated"),
            error: t("status.error"),
        },
        invalidate: [["admin-applications"]],
    });

    const onUpdateStatus = (id: number, status: ApplicationStatus, itemKind: ApplicationKind) => {
        statusMutation.mutate({ id, status, kind: itemKind });
    };

    const data = applicationsQuery.data;
    const totalPages = data?.totalPages ?? 1;

    return {
        t,
        applications: data?.data ?? [],
        total: data?.total ?? 0,
        page,
        totalPages,
        isListLoading: applicationsQuery.isLoading,
        isListFetching: applicationsQuery.isFetching,
        goToNextPage: () => setPage((prev) => Math.min(prev + 1, totalPages)),
        goToPrevPage: () => setPage((prev) => Math.max(prev - 1, 1)),
        kind,
        setKind,
        onUpdateStatus,
        updatingKey: statusMutation.isPending
            ? `${statusMutation.variables?.kind}-${statusMutation.variables?.id}`
            : undefined,
    };
};

export { useAdminApplicationsController };
