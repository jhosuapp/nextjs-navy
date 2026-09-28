import type { JSX, ReactNode } from "react";
import { Spinner } from "@/shared/components/spinner/Spinner";
import { useAdminLoginController, useAdminSessionQuery } from "../../hooks";
import { LoginForm } from "../../components/login-form/LoginForm";
import styles from "./authGuard.module.css";

type Props = {
    children: ReactNode;
};

const LoginScreen = (): JSX.Element => {
    const { t, control, errors, onSubmit, isLoggingIn } = useAdminLoginController();

    return (
        <div className={styles.authGuard}>
            <LoginForm t={t} control={control} errors={errors} onSubmit={onSubmit} isLoading={isLoggingIn} />
        </div>
    );
};

/** Muestra el panel solo con sesión válida; si no, el login a pantalla completa. */
const AuthGuard = ({ children }: Props): JSX.Element => {
    const { data, isLoading } = useAdminSessionQuery();

    if (isLoading) {
        return (
            <div className={styles.authGuard}>
                <Spinner />
            </div>
        );
    }

    if (!data?.authenticated) return <LoginScreen />;

    return <>{children}</>;
};

export { AuthGuard };
