import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast, type Id } from "react-toastify";
import { ADMIN_SESSION_KEY } from "./useAdminSession.query";
import { isUnauthorized } from "./useUnauthorizedGuard";

type ToastMessages = {
    loading: string;
    success: string;
    error: string;
};

type Options<TVariables, TData> = {
    mutationFn: (variables: TVariables) => Promise<TData>;
    messages: ToastMessages;
    /** Queries a invalidar al terminar con éxito. */
    invalidate?: QueryKey[];
    onSuccess?: (data: TData, variables: TVariables) => void;
};

const serverMessage = (error: unknown): string | undefined => {
    if (error instanceof AxiosError) {
        const message = (error.response?.data as { message?: unknown } | undefined)?.message;
        return typeof message === "string" ? message : undefined;
    }
    return undefined;
};

/**
 * `useMutation` con el ciclo de toasts del panel (cargando → ok/error),
 * invalidación de queries y vuelta al login si la sesión ha caducado.
 */
const useAdminMutation = <TVariables, TData = unknown>({
    mutationFn,
    messages,
    invalidate = [],
    onSuccess,
}: Options<TVariables, TData>) => {
    const queryClient = useQueryClient();

    return useMutation<TData, unknown, TVariables, { toastId: Id }>({
        mutationFn,
        onMutate: () => ({ toastId: toast.loading(messages.loading) }),
        onSuccess: (data, variables, context) => {
            toast.update(context.toastId, {
                render: messages.success,
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });
            invalidate.forEach((queryKey) => queryClient.invalidateQueries({ queryKey }));
            onSuccess?.(data, variables);
        },
        onError: (error, _variables, context) => {
            const render = serverMessage(error) ?? messages.error;
            if (context) {
                toast.update(context.toastId, {
                    render,
                    type: "error",
                    isLoading: false,
                    autoClose: 4000,
                });
            } else {
                toast.error(render);
            }
            if (isUnauthorized(error)) {
                queryClient.invalidateQueries({ queryKey: ADMIN_SESSION_KEY });
            }
        },
    });
};

export { useAdminMutation };
