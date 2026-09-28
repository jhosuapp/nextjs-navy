import { memo, type JSX } from "react";
import { Controller, UseFormReturn, useFormState, useWatch } from "react-hook-form";
import {
    AdminButton,
    AdminDialog,
    AdminInput,
    AdminTextarea,
    AdminToggle,
    FieldShell,
    ResetButton,
} from "@/features/admin-core/components";
import { formatDateTime, toDateTimeLocal } from "@/features/admin-core/helpers";
import { ADMIN_RULES } from "@/shared/constants/admin";
import { ITranslations } from "@/shared/interfaces/globals";
import { AdminBan } from "../../interfaces";
import { BanFormValues } from "../../validations/ban-form.validation";
import styles from "./banEditDrawer.module.css";

type Props = {
    t: ITranslations;
    locale?: string;
    ban: AdminBan | null;
    form: UseFormReturn<BanFormValues>;
    onSubmit: () => void;
    onClose: () => void;
    isSaving: boolean;
};

const BanEditDrawer = memo(
    ({ t, locale, ban, form, onSubmit, onClose, isSaving }: Props): JSX.Element => {
        const { control, setValue, getValues } = form;
        const { errors, isDirty } = useFormState({ control });
        const permanent = useWatch({ control, name: "permanent" });

        const original = ban?.original;

        const resetAction = (field: "nick" | "reason", value: string) =>
            getValues(field) !== value ? (
                <ResetButton
                    label={t("common.reset")}
                    onClick={() => setValue(field, value, { shouldDirty: true, shouldValidate: true })}
                />
            ) : undefined;

        const originalExpiration =
            original?.expiration === null ? t("bans.permanent") : formatDateTime(original?.expiration, locale);

        return (
            <AdminDialog
                isOpen={ban !== null}
                onClose={onClose}
                variant="drawer"
                title={t("bans.edit.title", { id: ban?.id })}
                description={t("bans.edit.description")}
                closeLabel={t("common.close")}
                footer={
                    <>
                        <AdminButton variant="ghost" onClick={onClose} disabled={isSaving}>
                            {t("common.cancel")}
                        </AdminButton>
                        <AdminButton type="submit" form="ban-edit-form" isLoading={isSaving} disabled={!isDirty}>
                            {t("common.save")}
                        </AdminButton>
                    </>
                }
            >
                {ban && original && (
                    <form id="ban-edit-form" className={styles.banEdit} onSubmit={onSubmit} noValidate>
                        <p className={styles.banEdit__notice}>{t("bans.edit.notice")}</p>

                        <Controller
                            name="nick"
                            control={control}
                            render={({ field }) => (
                                <FieldShell
                                    id="ban-nick"
                                    label={t("bans.edit.nick")}
                                    error={errors.nick?.message}
                                    hint={t("common.originalValue", { value: original.nick ?? "—" })}
                                    action={resetAction("nick", original.nick ?? "")}
                                >
                                    <AdminInput id="ban-nick" maxLength={16} autoComplete="off" hasError={!!errors.nick} {...field} />
                                </FieldShell>
                            )}
                        />

                        <Controller
                            name="reason"
                            control={control}
                            render={({ field }) => (
                                <FieldShell
                                    id="ban-reason"
                                    label={t("bans.edit.reason")}
                                    error={errors.reason?.message}
                                    hint={t("common.originalValue", { value: original.reason })}
                                    action={resetAction("reason", original.reason)}
                                >
                                    <AdminTextarea
                                        id="ban-reason"
                                        rows={4}
                                        maxLength={ADMIN_RULES.reasonMax}
                                        hasError={!!errors.reason}
                                        {...field}
                                    />
                                </FieldShell>
                            )}
                        />

                        <Controller
                            name="is_cheater"
                            control={control}
                            render={({ field }) => (
                                <AdminToggle
                                    id="ban-cheater"
                                    label={t("bans.edit.cheater")}
                                    description={t("common.originalValue", {
                                        value: original.is_cheater ? t("common.yes") : t("common.no"),
                                    })}
                                    checked={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />

                        <div className={styles.banEdit__group}>
                            <Controller
                                name="permanent"
                                control={control}
                                render={({ field }) => (
                                    <AdminToggle
                                        id="ban-permanent"
                                        label={t("bans.edit.permanent")}
                                        description={t("common.originalValue", { value: originalExpiration })}
                                        checked={field.value}
                                        onChange={(checked) => {
                                            field.onChange(checked);
                                            if (!checked && !getValues("expiration")) {
                                                // Sugerencia: 30 días desde ahora.
                                                const suggestion = new Date(Date.now() + 30 * 86400000).toISOString();
                                                setValue("expiration", toDateTimeLocal(suggestion), {
                                                    shouldDirty: true,
                                                    shouldValidate: true,
                                                });
                                            }
                                        }}
                                    />
                                )}
                            />

                            {!permanent && (
                                <Controller
                                    name="expiration"
                                    control={control}
                                    render={({ field }) => (
                                        <FieldShell
                                            id="ban-expiration"
                                            label={t("bans.edit.expiration")}
                                            error={errors.expiration?.message}
                                        >
                                            <AdminInput
                                                id="ban-expiration"
                                                type="datetime-local"
                                                hasError={!!errors.expiration}
                                                {...field}
                                            />
                                        </FieldShell>
                                    )}
                                />
                            )}
                        </div>

                        {ban.updated_by && (
                            <p className={styles.banEdit__meta}>
                                {t("common.lastEdit", { user: ban.updated_by, date: formatDateTime(ban.updated_at, locale) })}
                            </p>
                        )}
                    </form>
                )}
            </AdminDialog>
        );
    }
);

BanEditDrawer.displayName = "BanEditDrawer";

export { BanEditDrawer };
