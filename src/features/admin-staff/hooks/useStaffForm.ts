import { useEffect, useMemo } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ITranslations } from "@/shared/interfaces/globals";
import { AdminStaffMember, StaffEditableFields, StaffPatchBody } from "../interfaces";
import { createStaffFormSchema, StaffFormValues } from "../validations/staff-form.validation";

const toFormValues = (fields: StaffEditableFields): StaffFormValues => ({
    nick: fields.nick ?? "",
    role_name: fields.role_name,
    role_colour: fields.role_colour,
    role_weight: String(fields.role_weight),
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
            }),
        [t]
    );

    const form = useForm<StaffFormValues>({
        mode: "onChange",
        resolver: zodResolver(schema) as Resolver<StaffFormValues>,
        defaultValues: { nick: "", role_name: "", role_colour: "#000000", role_weight: "0" },
    });

    const { reset } = form;
    useEffect(() => {
        if (member) reset(toFormValues(member.current));
    }, [member, reset]);

    return form;
};

export { useStaffForm };
