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
import { AdminTester } from "../../interfaces";
import { TesterFormValues } from "../../validations/tester-form.validation";
import styles from "./testerEditDialog.module.css";

type Props = {
    t: ITranslations;
    tester: AdminTester | null;
    form: UseFormReturn<TesterFormValues>;
    onSubmit: () => void;
    onClose: () => void;
    isSaving: boolean;
};

const TesterEditDialog = memo(
    ({ t, tester, form, onSubmit, onClose, isSaving }: Props): JSX.Element => {
        const { control, setValue, getValues } = form;
        const { errors, isDirty } = useFormState({ control });
        const baseNick = tester?.base_nick ?? "";

        return (
            <AdminDialog
                isOpen={tester !== null}
                onClose={onClose}
                title={t("testers.edit.title")}
                description={t("testers.edit.description")}
                closeLabel={t("common.close")}
                footer={
                    <>
                        <AdminButton variant="ghost" onClick={onClose} disabled={isSaving}>
                            {t("common.cancel")}
                        </AdminButton>
                        <AdminButton type="submit" form="tester-edit-form" isLoading={isSaving} disabled={!isDirty}>
                            {t("common.save")}
                        </AdminButton>
                    </>
                }
            >
                {tester && (
                    <form id="tester-edit-form" className={styles.testerEdit} onSubmit={onSubmit} noValidate>
                        <Controller
                            name="nick"
                            control={control}
                            render={({ field }) => (
                                <FieldShell
                                    id="tester-nick"
                                    label={t("testers.edit.nick")}
                                    error={errors.nick?.message}
                                    hint={
                                        tester.base_nick
                                            ? t("testers.edit.detected", { value: tester.base_nick })
                                            : t("testers.edit.noDetected")
                                    }
                                    action={
                                        getValues("nick") !== baseNick ? (
                                            <ResetButton
                                                label={t("common.reset")}
                                                onClick={() =>
                                                    setValue("nick", baseNick, { shouldDirty: true, shouldValidate: true })
                                                }
                                            />
                                        ) : undefined
                                    }
                                >
                                    <AdminInput id="tester-nick" maxLength={16} autoComplete="off" hasError={!!errors.nick} {...field} />
                                </FieldShell>
                            )}
                        />
                        <p className={styles.testerEdit__notice}>{t("testers.edit.notice", { id: tester.discord_id })}</p>
                    </form>
                )}
            </AdminDialog>
        );
    }
);

TesterEditDialog.displayName = "TesterEditDialog";

export { TesterEditDialog };
