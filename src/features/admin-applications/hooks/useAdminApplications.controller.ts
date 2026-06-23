import { useEffect, useMemo, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";
import {
    loginAction,
    logoutAction,
    patchApplicationStatusAction,
} from "../actions";
import { ApplicationStatus } from "../interfaces";
import {
    useApplicationsQuery,
    useSessionQuery,
} from "./useAdminApplications.query";
import {
    createLoginSchema,
    LoginFormInterface,
    LoginMessages,
} from "../validations/login.validation";

const useAdminApplicationsController = () => {
    const { t } = useTranslation("admin");
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);

    const sessionQuery = useSessionQuery();
    const isAuthenticated = sessionQuery.data?.authenticated ?? false;

    const applicationsQuery = useApplicationsQuery(
        page,
        isAuthenticated && !sessionQuery.isLoading
    );

    // Sesión expirada en pleno uso: revalidar el estado de auth.
    const listError = applicationsQuery.error;
    useEffect(() => {
        if (
            listError instanceof AxiosError &&
            listError.response?.status === 401
        ) {
            queryClient.invalidateQueries({ queryKey: ["admin-session"] });
        }
    }, [listError, queryClient]);

    const messages = useMemo<LoginMessages>(
        () => ({
            required: t("login.validation.required"),
            usernameLength: t("login.validation.usernameLength"),
            passwordLength: t("login.validation.passwordLength"),
        }),
        [t]
    );

    const schema = useMemo(() => createLoginSchema(messages), [messages]);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<LoginFormInterface>({
        mode: "onChange",
        resolver: zodResolver(schema) as Resolver<LoginFormInterface>,
        defaultValues: { username: "", password: "" },
    });

    const loginMutation = useMutation({ mutationFn: loginAction });
    const logoutMutation = useMutation({ mutationFn: logoutAction });

    const statusMutation = useMutation({
        mutationFn: ({ id, status }: { id: number; status: ApplicationStatus }) =>
            patchApplicationStatusAction(id, { status }),
        onMutate: () => {
            const toastId = toast.loading(t("status.loading"));
            return { toastId };
        },
        onSuccess: (_data, _variables, context) => {
            toast.update(context.toastId, {
                render: t("status.updated"),
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });
            queryClient.invalidateQueries({ queryKey: ["admin-applications"] });
        },
        onError: (_error, _variables, context) => {
            toast.update(context!.toastId, {
                render: t("status.error"),
                type: "error",
                isLoading: false,
                autoClose: 4000,
            });
        },
    });

    const onUpdateStatus = (id: number, status: ApplicationStatus) => {
        statusMutation.mutate({ id, status });
    };

    const onLogin = async (formData: LoginFormInterface) => {
        try {
            await loginMutation.mutateAsync(formData);
            setPage(1);
            await queryClient.invalidateQueries({ queryKey: ["admin-session"] });
            reset();
        } catch (error) {
            let message = t("login.feedback.error");
            if (
                error instanceof AxiosError &&
                error.response?.status === 401
            ) {
                message = t("login.feedback.invalid");
            }
            toast.error(message);
        }
    };

    const onLogout = async () => {
        await logoutMutation.mutateAsync();
        setPage(1);
        queryClient.removeQueries({ queryKey: ["admin-applications"] });
        await queryClient.invalidateQueries({ queryKey: ["admin-session"] });
    };

    const data = applicationsQuery.data;
    const totalPages = data?.totalPages ?? 1;

    const goToNextPage = () => {
        if (page < totalPages) setPage((prev) => prev + 1);
    };

    const goToPrevPage = () => {
        if (page > 1) setPage((prev) => prev - 1);
    };

    return {
        t,
        // auth
        isAuthenticated,
        sessionLoading: sessionQuery.isLoading,
        username: sessionQuery.data?.username,
        // login form
        control,
        errors,
        handleSubmit,
        onLogin,
        isLoggingIn: loginMutation.isPending,
        // logout
        onLogout,
        isLoggingOut: logoutMutation.isPending,
        // listing
        applications: data?.data ?? [],
        total: data?.total ?? 0,
        page,
        totalPages,
        isListLoading: applicationsQuery.isLoading,
        isListFetching: applicationsQuery.isFetching,
        goToNextPage,
        goToPrevPage,
        // status
        onUpdateStatus,
        updatingId: statusMutation.isPending
            ? statusMutation.variables?.id
            : undefined,
    };
};

export { useAdminApplicationsController };
