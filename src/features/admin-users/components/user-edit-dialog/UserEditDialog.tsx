import { memo, type JSX } from "react";
import { Controller, UseFormReturn, useFormState } from "react-hook-form";
import {
    AdminButton,
    AdminDialog,
    AdminInput,
    FieldShell,
    ResetButton,
} from "@/features/admin-core/components";
import { ITranslations } from "@/shared/interfaces/globals";
import { AdminUser } from "../../interfaces";
import { UserFormValues } from "../../validations/user-form.validation";
import styles from "./userEditDialog.module.css";

type Props = {
    t: ITranslations;
    user: AdminUser | null;
    form: UseFormReturn<UserFormValues>;
    onSubmit: () => void;
    onClose: () => void;
    isSaving: boolean;
};

const UserEditDialog = memo(
    ({ t, user, form, onSubmit, onClose, isSaving }: Props): JSX.Element => {
        const { control, setValue, getValues } = form;
        const { errors, isDirty } = useFormState({ control });

        return (
            <AdminDialog
                isOpen={user !== null}
                onClose={onClose}
                title={t("users.edit.title")}
                description={t("users.edit.description")}
                closeLabel={t("common.close")}
                footer={
                    <>
                        <AdminButton variant="ghost" onClick={onClose} disabled={isSaving}>
                            {t("common.cancel")}
                        </AdminButton>
                        <AdminButton type="submit" form="user-edit-form" isLoading={isSaving} disabled={!isDirty}>
                            {t("common.save")}
                        </AdminButton>
                    </>
                }
            >
                {user && (
                    <form id="user-edit-form" className={styles.userEdit} onSubmit={onSubmit} noValidate>
                        <Controller
                            name="nick"
                            control={control}
                            render={({ field }) => (
                                <FieldShell
                                    id="user-nick"
                                    label={t("users.edit.nick")}
                                    error={errors.nick?.message}
                                    hint={t("common.originalValue", { value: user.original_nick })}
                                    action={
                                        getValues("nick") !== user.original_nick ? (
                                            <ResetButton
                                                label={t("common.reset")}
                                                onClick={() =>
                                                    setValue("nick", user.original_nick, {
                                                        shouldDirty: true,
                                                        shouldValidate: true,
                                                    })
                                                }
                                            />
                                        ) : undefined
                                    }
                                >
                                    <AdminInput id="user-nick" maxLength={16} autoComplete="off" hasError={!!errors.nick} {...field} />
                                </FieldShell>
                            )}
                        />
                        <p className={styles.userEdit__notice}>{t("users.edit.notice")}</p>
                    </form>
                )}
            </AdminDialog>
        );
    }
);

UserEditDialog.displayName = "UserEditDialog";

export { UserEditDialog };
