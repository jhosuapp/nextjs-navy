import { memo, type JSX } from "react";
import { Controller, UseFormReturn, useFormState } from "react-hook-form";
import {
    AdminButton,
    AdminDialog,
    AdminInput,
    AdminTextarea,
    AdminToggle,
    FieldShell,
    ResetButton,
} from "@/features/admin-core/components";
import { SOCIAL_PREFIX, STAFF_PROFILE_RULES, STAFF_SOCIALS, STAFF_STATUS_MODES } from "@/shared/constants/staffProfile";
import { formatDateTime } from "@/features/admin-core/helpers";
import { ITranslations } from "@/shared/interfaces/globals";
import { AdminStaffMember } from "../../interfaces";
import { StaffFormValues } from "../../validations/staff-form.validation";
import { SongPicker } from "../song-picker/SongPicker";
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

                        <section className={styles.staffEdit__section} aria-labelledby="staff-profile-title">
                            <div>
                                <h3 id="staff-profile-title" className={styles.staffEdit__sectionTitle}>
                                    {t("staff.profile.title")}
                                </h3>
                                <p className={styles.staffEdit__sectionText}>{t("staff.profile.description")}</p>
                            </div>

                            <Controller
                                name="status_mode"
                                control={control}
                                render={({ field }) => (
                                    <div className={styles.staffEdit__field}>
                                        <span id="staff-status-label" className={styles.staffEdit__label}>
                                            {t("staff.profile.status")}
                                        </span>
                                        <div className={styles.staffEdit__segmented} role="radiogroup" aria-labelledby="staff-status-label">
                                            {(["auto", ...STAFF_STATUS_MODES] as const).map((mode) => (
                                                <button
                                                    key={mode}
                                                    type="button"
                                                    role="radio"
                                                    aria-checked={field.value === mode}
                                                    className={styles.staffEdit__segment}
                                                    onClick={() => field.onChange(mode)}
                                                >
                                                    {t(`staff.profile.statuses.${mode}`)}
                                                </button>
                                            ))}
                                        </div>
                                        <p className={styles.staffEdit__hint}>
                                            {member.activity.auto_status
                                                ? t("staff.profile.autoHint", {
                                                      status: t(`staff.profile.statuses.${member.activity.auto_status}`),
                                                      count: member.activity.recent_tests,
                                                  })
                                                : t("staff.profile.autoHintNoTester")}
                                        </p>
                                    </div>
                                )}
                            />

                            <Controller
                                name="bio"
                                control={control}
                                render={({ field }) => (
                                    <FieldShell
                                        id="staff-bio"
                                        label={t("staff.profile.bio")}
                                        error={errors.bio?.message}
                                        hint={t("staff.profile.bioHint", {
                                            count: field.value.length,
                                            max: STAFF_PROFILE_RULES.bioMax,
                                        })}
                                    >
                                        <AdminTextarea
                                            id="staff-bio"
                                            rows={3}
                                            maxLength={STAFF_PROFILE_RULES.bioMax}
                                            hasError={!!errors.bio}
                                            {...field}
                                        />
                                    </FieldShell>
                                )}
                            />

                            <Controller
                                name="song"
                                control={control}
                                render={({ field }) => (
                                    <div className={styles.staffEdit__field}>
                                        <span className={styles.staffEdit__label}>{t("staff.profile.song.label")}</span>
                                        <SongPicker t={t} value={field.value} onChange={field.onChange} />
                                        <p className={styles.staffEdit__hint}>{t("staff.profile.song.hint")}</p>
                                    </div>
                                )}
                            />

                            <div className={styles.staffEdit__socials}>
                                {STAFF_SOCIALS.map((key) => (
                                    <Controller
                                        key={key}
                                        name={key}
                                        control={control}
                                        render={({ field }) => (
                                            <FieldShell
                                                id={`staff-${key}`}
                                                label={t(`staff.profile.socials.${key}`)}
                                                error={errors[key]?.message}
                                            >
                                                <div className={styles.staffEdit__prefixed}>
                                                    <span aria-hidden="true">{SOCIAL_PREFIX[key]}</span>
                                                    <AdminInput
                                                        id={`staff-${key}`}
                                                        maxLength={60}
                                                        autoComplete="off"
                                                        spellCheck={false}
                                                        placeholder={t("staff.profile.handlePlaceholder")}
                                                        hasError={!!errors[key]}
                                                        {...field}
                                                    />
                                                </div>
                                            </FieldShell>
                                        )}
                                    />
                                ))}
                            </div>

                            <Controller
                                name="show_namemc"
                                control={control}
                                render={({ field }) => (
                                    <AdminToggle
                                        id="staff-namemc"
                                        label={t("staff.profile.namemc")}
                                        description={
                                            member.is_premium ? t("staff.profile.namemcHint") : t("staff.profile.namemcNoPremium")
                                        }
                                        checked={field.value}
                                        disabled={!member.is_premium}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        </section>

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
