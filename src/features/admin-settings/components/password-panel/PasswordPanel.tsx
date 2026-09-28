import { memo, type JSX } from "react";
import { Controller, useFormState } from "react-hook-form";
import { KeyIcon } from "@/config/assets/icon/admin/AdminIcons";
import { AdminButton, AdminInput, FieldShell, Panel } from "@/features/admin-core/components";
import { ITranslations } from "@/shared/interfaces/globals";
import { AdminSettingsController } from "../../hooks";
import styles from "./passwordPanel.module.css";

type Props = {
    t: ITranslations;
    password: AdminSettingsController["password"];
};

const FIELDS = [
    { name: "current", autoComplete: "current-password" },
    { name: "next", autoComplete: "new-password" },
    { name: "confirm", autoComplete: "new-password" },
] as const;

const PasswordPanel = memo(
    ({ t, password }: Props): JSX.Element => {
        const { control } = password.form;
        const { errors, isDirty } = useFormState({ control });

        return (
            <Panel title={t("settings.password.title")} description={t("settings.password.description")} icon={<KeyIcon />}>
                <form className={styles.password} onSubmit={password.onSubmit} noValidate>
                    {FIELDS.map(({ name, autoComplete }) => (
                        <Controller
                            key={name}
                            name={name}
                            control={control}
                            render={({ field }) => (
                                <FieldShell
                                    id={`password-${name}`}
                                    label={t(`settings.password.${name}`)}
                                    error={errors[name]?.message}
                                >
                                    <AdminInput
                                        id={`password-${name}`}
                                        type="password"
                                        autoComplete={autoComplete}
                                        hasError={!!errors[name]}
                                        {...field}
                                    />
                                </FieldShell>
                            )}
                        />
                    ))}
                    <div className={styles.password__actions}>
                        <AdminButton type="submit" isLoading={password.isSaving} disabled={!isDirty}>
                            {t("settings.password.submit")}
                        </AdminButton>
                    </div>
                </form>
            </Panel>
        );
    }
);

PasswordPanel.displayName = "PasswordPanel";

export { PasswordPanel };
