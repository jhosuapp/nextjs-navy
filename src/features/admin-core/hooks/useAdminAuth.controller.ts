import { useMemo } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";
import { loginAction, logoutAction } from "../actions";
import { ADMIN_SESSION_KEY, useAdminSessionQuery } from "./useAdminSession.query";
import {
    createLoginSchema,
    LoginFormInterface,
    LoginMessages,
} from "../validations/login.validation";

/** Formulario de login del panel (lo usa el AuthGuard). */
const useAdminLoginController = () => {
    const { t } = useTranslation("admin");
    const queryClient = useQueryClient();

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

    const onLogin = async (formData: LoginFormInterface) => {
        try {
            await loginMutation.mutateAsync(formData);
            await queryClient.invalidateQueries({ queryKey: ADMIN_SESSION_KEY });
            reset();
        } catch (error) {
            const message =
                error instanceof AxiosError && error.response?.status === 401
                    ? t("login.feedback.invalid")
                    : t("login.feedback.error");
            toast.error(message);
        }
    };

    return {
        t,
        control,
        errors,
        onSubmit: handleSubmit(onLogin),
        isLoggingIn: loginMutation.isPending,
    };
};

/** Estado de sesión + logout (sidebar y guard). */
const useAdminSessionController = () => {
    const queryClient = useQueryClient();
    const sessionQuery = useAdminSessionQuery();
    const logoutMutation = useMutation({ mutationFn: logoutAction });

    const onLogout = async () => {
        await logoutMutation.mutateAsync();
        // Nada de datos del panel en caché tras cerrar sesión.
        queryClient.removeQueries({
            predicate: (query) =>
                String(query.queryKey[0]).startsWith("admin-") &&
                query.queryKey[0] !== ADMIN_SESSION_KEY[0],
        });
        await queryClient.invalidateQueries({ queryKey: ADMIN_SESSION_KEY });
    };

    return {
        isLoading: sessionQuery.isLoading,
        isAuthenticated: sessionQuery.data?.authenticated ?? false,
        username: sessionQuery.data?.username,
        onLogout,
        isLoggingOut: logoutMutation.isPending,
    };
};

export { useAdminLoginController, useAdminSessionController };
