import { memo, type JSX } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { motion } from "framer-motion";
import { InputField } from "@/shared/components/input-field/InputField";
import { Button } from "@/shared/components/button/Button";
import { ITranslations } from "@/shared/interfaces/globals";
import { fadeUpMotion } from "@/shared/motion/fadeUp.motion";
import { LoginFormInterface } from "../../validations/login.validation";
import styles from "./loginForm.module.css";

type Props = {
    t: ITranslations;
    control: Control<LoginFormInterface>;
    errors: FieldErrors<LoginFormInterface>;
    onSubmit: () => void;
    isLoading: boolean;
};

const LoginForm = memo(
    ({ t, control, errors, onSubmit, isLoading }: Props): JSX.Element => (
        <motion.form
            className={styles.login}
            onSubmit={onSubmit}
            noValidate
            {...fadeUpMotion(0.57, 0)}
        >
            <header className={styles.login__header}>
                <h1 className={styles.login__title}>{t("login.title")}</h1>
                <p className={styles.login__subtitle}>{t("login.subtitle")}</p>
            </header>

            <Controller
                name="username"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <InputField
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        placeholder={t("login.usernamePlaceholder")}
                        feedback={errors.username?.message}
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value ?? ""}
                    />
                )}
            />

            <Controller
                name="password"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <InputField
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        placeholder={t("login.passwordPlaceholder")}
                        feedback={errors.password?.message}
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value ?? ""}
                    />
                )}
            />

            <Button
                type="submit"
                text={t("login.submit")}
                style="secondary"
                isLoad={isLoading}
                className="!w-full"
            />
        </motion.form>
    )
);

LoginForm.displayName = "LoginForm";

export { LoginForm };
