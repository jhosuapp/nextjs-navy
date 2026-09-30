import { useCallback, useDeferredValue, useMemo, useState } from "react";
import { useTranslation } from "next-i18next";
import { useAdminMutation, useUnauthorizedGuard } from "@/features/admin-core/hooks";
import { patchStaffAction, patchStaffProfileAction } from "../actions";
import { AdminStaffMember, StaffPatchBody, StaffProfilePatchBody, StaffVisibilityFilter } from "../interfaces";
import { STAFF_OVERRIDE_FORM_FIELDS, StaffFormValues } from "../validations/staff-form.validation";
import { ADMIN_STAFF_KEY, useAdminStaffQuery } from "./useAdminStaff.query";
import { toProfilePatch, toStaffPatch, useStaffForm } from "./useStaffForm";

/** `body` → overrides del bot; `profile` → perfil público. Se envía solo lo que cambia. */
type PatchVariables = { discordId: string; body?: StaffPatchBody; profile?: StaffProfilePatchBody };

const matches = (member: AdminStaffMember, needle: string): boolean =>
    !needle ||
    [member.current.nick, member.original.nick, member.current.role_name, member.discord_id, member.uuid].some((value) =>
        value?.toLowerCase().includes(needle)
    );

const useAdminStaffController = () => {
    const { t } = useTranslation("admin");
    const [search, setSearch] = useState("");
    const [visibility, setVisibility] = useState<StaffVisibilityFilter>("visible");
    const [editing, setEditing] = useState<AdminStaffMember | null>(null);
    const [hiding, setHiding] = useState<AdminStaffMember | null>(null);

    const staffQuery = useAdminStaffQuery();
    useUnauthorizedGuard(staffQuery.error);

    const deferredSearch = useDeferredValue(search.trim().toLowerCase());
    const members = useMemo(() => staffQuery.data?.data ?? [], [staffQuery.data]);

    const counts = useMemo(
        () => ({
            visible: members.filter((member) => !member.hidden).length,
            hidden: members.filter((member) => member.hidden).length,
        }),
        [members]
    );

    const filtered = useMemo(
        () =>
            members.filter(
                (member) => (visibility === "hidden") === member.hidden && matches(member, deferredSearch)
            ),
        [members, visibility, deferredSearch]
    );

    const form = useStaffForm(t, editing);

    const patchMutation = useAdminMutation<PatchVariables>({
        mutationFn: async ({ discordId, body, profile }) => {
            const response = body ? await patchStaffAction(discordId, body) : undefined;
            const profileResponse = profile ? await patchStaffProfileAction(discordId, profile) : undefined;
            return (profileResponse ?? response)!;
        },
        messages: { loading: t("common.saving"), success: t("common.saved"), error: t("common.saveError") },
        invalidate: [ADMIN_STAFF_KEY],
        onSuccess: () => {
            setEditing(null);
            setHiding(null);
        },
    });

    const { mutate } = patchMutation;

    const onSubmitEdit = form.handleSubmit((values: StaffFormValues) => {
        if (!editing) return;
        const { dirtyFields } = form.formState;
        const overridesChanged = STAFF_OVERRIDE_FORM_FIELDS.some((field) => dirtyFields[field]);
        const profile = toProfilePatch(values, editing.profile);
        const profileChanged = Object.keys(profile).length > 0;

        if (!overridesChanged && !profileChanged) return setEditing(null);

        mutate({
            discordId: editing.discord_id,
            body: overridesChanged ? toStaffPatch(values, editing.original) : undefined,
            profile: profileChanged ? profile : undefined,
        });
    });

    const onConfirmHide = (reason: string) => {
        if (!hiding) return;
        mutate({
            discordId: hiding.discord_id,
            body: { hidden: true, hidden_reason: reason || null },
        });
    };

    const onRestore = useCallback(
        (member: AdminStaffMember) => mutate({ discordId: member.discord_id, body: { hidden: false } }),
        [mutate]
    );

    return {
        t,
        // listado
        members: filtered,
        counts,
        isLoading: staffQuery.isLoading,
        isFetching: staffQuery.isFetching,
        search,
        setSearch,
        visibility,
        setVisibility,
        // edición
        editing,
        openEdit: setEditing,
        closeEdit: () => setEditing(null),
        form,
        onSubmitEdit,
        // ocultar / restaurar
        hiding,
        openHide: setHiding,
        closeHide: () => setHiding(null),
        onConfirmHide,
        onRestore,
        isSaving: patchMutation.isPending,
        pendingId: patchMutation.isPending ? patchMutation.variables?.discordId : undefined,
    };
};

export { useAdminStaffController };
