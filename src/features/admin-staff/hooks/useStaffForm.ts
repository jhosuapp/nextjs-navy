import { useEffect, useMemo } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ITranslations } from "@/shared/interfaces/globals";
import { normalizeHandle, STAFF_SOCIALS } from "@/shared/constants/staffProfile";
import { AdminStaffMember, StaffEditableFields, StaffPatchBody, StaffProfileFields, StaffProfilePatchBody } from "../interfaces";
import { createStaffFormSchema, StaffFormValues } from "../validations/staff-form.validation";

const toFormValues = (fields: StaffEditableFields, profile: StaffProfileFields): StaffFormValues => ({
    nick: fields.nick ?? "",
    role_name: fields.role_name,
    role_colour: fields.role_colour,
    role_weight: String(fields.role_weight),
    bio: profile.bio ?? "",
    status_mode: profile.status_mode ?? "auto",
    instagram: profile.instagram ?? "",
    tiktok: profile.tiktok ?? "",
    youtube: profile.youtube ?? "",
    twitch: profile.twitch ?? "",
    x: profile.x ?? "",
    github: profile.github ?? "",
    linkedin: profile.linkedin ?? "",
    discord_username: profile.discord_username ?? "",
    show_namemc: profile.show_namemc,
});

/**
 * Convierte el formulario en un PATCH: un campo igual al valor del bot quita
 * el override (`null`); si difiere, se guarda como override.
 */
export const toStaffPatch = (values: StaffFormValues, original: StaffEditableFields): StaffPatchBody => {
    const nick = values.nick.trim();
    const weight = Number(values.role_weight);
    const colour = values.role_colour.toUpperCase();

    return {
        nick: nick === "" || nick === original.nick ? null : nick,
        role_name: values.role_name === original.role_name ? null : values.role_name,
        role_colour: colour === original.role_colour.toUpperCase() ? null : colour,
        role_weight: weight === original.role_weight ? null : weight,
    };
};

/** PATCH del perfil público: solo los campos que cambian; vacío = `null`. */
export const toProfilePatch = (values: StaffFormValues, profile: StaffProfileFields): StaffProfilePatchBody => {
    const next: StaffProfileFields = {
        bio: values.bio.trim() || null,
        status_mode: values.status_mode === "auto" ? null : values.status_mode,
        instagram: null,
        tiktok: null,
        youtube: null,
        twitch: null,
        x: null,
        github: null,
        linkedin: null,
        discord_username: null,
        show_namemc: values.show_namemc,
    };
    for (const key of STAFF_SOCIALS) {
        const raw = values[key].trim();
        next[key] = raw ? normalizeHandle(key, raw) : null;
    }

    const patch: StaffProfilePatchBody = {};
    for (const key of Object.keys(next) as Array<keyof StaffProfileFields>) {
        if (next[key] !== profile[key]) (patch as Record<string, unknown>)[key] = next[key];
    }
    return patch;
};

/** Formulario del drawer de edición de staff. */
const useStaffForm = (t: ITranslations, member: AdminStaffMember | null) => {
    const schema = useMemo(
        () =>
            createStaffFormSchema({
                required: t("form.required"),
                nick: t("form.nick"),
                colour: t("form.colour"),
                weight: t("form.weight"),
                roleName: t("form.roleName"),
                bio: t("form.bio"),
                handle: t("form.handle"),
            }),
        [t]
    );

    const form = useForm<StaffFormValues>({
        mode: "onChange",
        resolver: zodResolver(schema) as Resolver<StaffFormValues>,
        defaultValues: {
            nick: "",
            role_name: "",
            role_colour: "#000000",
            role_weight: "0",
            bio: "",
            status_mode: "auto",
            instagram: "",
            tiktok: "",
            youtube: "",
            twitch: "",
            x: "",
            github: "",
            linkedin: "",
            discord_username: "",
            show_namemc: true,
        },
    });

    const { reset } = form;
    useEffect(() => {
        if (member) reset(toFormValues(member.current, member.profile));
    }, [member, reset]);

    return form;
};

export { useStaffForm };
