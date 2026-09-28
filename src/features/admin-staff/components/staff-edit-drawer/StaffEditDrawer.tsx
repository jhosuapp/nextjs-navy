import { memo, type JSX } from "react";
import { Controller, UseFormReturn, useFormState } from "react-hook-form";
import {
    AdminButton,
    AdminDialog,
    AdminInput,
    FieldShell,
    ResetButton,
} from "@/features/admin-core/components";
import { formatDateTime } from "@/features/admin-core/helpers";
import { ITranslations } from "@/shared/interfaces/globals";
import { AdminStaffMember } from "../../interfaces";
import { StaffFormValues } from "../../validations/staff-form.validation";
import styles from "./staffEditDrawer.module.css";

type Props = {
    t: ITranslations;
    locale?: string;
    member: AdminStaffMember | null;
    form: UseFormReturn<StaffFormValues>;
    onSubmit: () => void;
    onClose: () => void;
    isSaving: boolean;
};

const StaffEditDrawer = memo(
    ({ t, locale, member, form, onSubmit, onClose, isSaving }: Props): JSX.Element => {
        const { control, setValue, getValues } = form;
        // Suscripción propia: el drawer está memoizado y no se re-renderiza con el padre.
        const { errors, isDirty } = useFormState({ control });

        const original = member?.original;

        /** Pista "valor del bot" + botón para volver a él. */
        const botHint = (field: keyof StaffFormValues, value: string) => ({
            hint: t("common.originalValue", { value: value || "—" }),
            action:
                getValues(field) !== value ? (
                    <ResetButton
                        label={t("common.reset")}
                        onClick={() => setValue(field, value, { shouldDirty: true, shouldValidate: true })}
                    />
                ) : undefined,
        });

        return (
            <AdminDialog
                isOpen={member !== null}
                onClose={onClose}
                variant="drawer"
                title={t("staff.edit.title")}
                description={t("staff.edit.description")}
                closeLabel={t("common.close")}
                footer={
                    <>
                        <AdminButton variant="ghost" onClick={onClose} disabled={isSaving}>
                            {t("common.cancel")}
                        </AdminButton>
                        <AdminButton type="submit" form="staff-edit-form" isLoading={isSaving} disabled={!isDirty}>
                            {t("common.save")}
                        </AdminButton>
                    </>
                }
            >
                {member && original && (
                    <form id="staff-edit-form" className={styles.staffEdit} onSubmit={onSubmit} noValidate>
                        <p className={styles.staffEdit__notice}>{t("staff.edit.notice")}</p>

                        <Controller
                            name="nick"
                            control={control}
                            render={({ field }) => (
                                <FieldShell
                                    id="staff-nick"
                                    label={t("staff.edit.nick")}
                                    error={errors.nick?.message}
                                    {...botHint("nick", original.nick ?? "")}
                                >
                                    <AdminInput id="staff-nick" maxLength={16} autoComplete="off" hasError={!!errors.nick} {...field} />
                                </FieldShell>
                            )}
                        />

                        <Controller
                            name="role_name"
                            control={control}
                            render={({ field }) => (
                                <FieldShell
                                    id="staff-role-name"
                                    label={t("staff.edit.roleName")}
                                    error={errors.role_name?.message}
                                    {...botHint("role_name", original.role_name)}
                                >
                                    <AdminInput id="staff-role-name" maxLength={64} hasError={!!errors.role_name} {...field} />
                                </FieldShell>
                            )}
                        />

                        <Controller
                            name="role_colour"
                            control={control}
                            render={({ field }) => (
                                <FieldShell
                                    id="staff-role-colour"
                                    label={t("staff.edit.roleColour")}
                                    error={errors.role_colour?.message}
                                    {...botHint("role_colour", original.role_colour)}
                                >
                                    <div className={styles.staffEdit__colour}>
                                        <input
                                            type="color"
                                            className={styles.staffEdit__swatch}
                                            aria-label={t("staff.edit.roleColour")}
                                            value={/^#[0-9A-Fa-f]{6}$/.test(field.value) ? field.value : "#000000"}
                                            onChange={(event) => field.onChange(event.target.value.toUpperCase())}
                                        />
                                        <AdminInput
                                            id="staff-role-colour"
                                            maxLength={7}
                                            hasError={!!errors.role_colour}
                                            {...field}
                                        />
                                    </div>
                                </FieldShell>
                            )}
                        />

                        <Controller
                            name="role_weight"
                            control={control}
                            render={({ field }) => (
                                <FieldShell
                                    id="staff-role-weight"
                                    label={t("staff.edit.roleWeight")}
                                    error={errors.role_weight?.message}
                                    {...botHint("role_weight", String(original.role_weight))}
                                >
                                    <AdminInput
                                        id="staff-role-weight"
                                        type="number"
                                        inputMode="numeric"
                                        hasError={!!errors.role_weight}
                                        {...field}
                                    />
                                </FieldShell>
                            )}
                        />

                        {member.updated_by && (
                            <p className={styles.staffEdit__meta}>
                                {t("common.lastEdit", {
                                    user: member.updated_by,
                                    date: formatDateTime(member.updated_at, locale),
                                })}
                            </p>
                        )}
                    </form>
                )}
            </AdminDialog>
        );
    }
);

StaffEditDrawer.displayName = "StaffEditDrawer";

export { StaffEditDrawer };
