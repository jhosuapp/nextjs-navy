import { useEffect, useMemo } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fromDateTimeLocal, toDateTimeLocal } from "@/features/admin-core/helpers";
import { ITranslations } from "@/shared/interfaces/globals";
import { AdminBan, BanEditableFields, BanPatchBody } from "../interfaces";
import { BanFormValues, createBanFormSchema } from "../validations/ban-form.validation";

const toFormValues = (fields: BanEditableFields): BanFormValues => ({
    nick: fields.nick ?? "",
    reason: fields.reason,
    is_cheater: fields.is_cheater,
    permanent: fields.expiration === null,
    expiration: toDateTimeLocal(fields.expiration),
});

/** Misma fecha al minuto (el input no tiene segundos). */
const sameMinute = (a: string | null, b: string | null): boolean => {
    if (a === null || b === null) return a === b;
    return Math.floor(new Date(a).getTime() / 60000) === Math.floor(new Date(b).getTime() / 60000);
};

/**
 * Formulario → PATCH. Igual al valor del bot = quitar override (`null`).
 * La expiración se guarda como modo (`permanent` | `date`) + fecha.
 */
export const toBanPatch = (values: BanFormValues, original: BanEditableFields): BanPatchBody => {
    const nick = values.nick.trim();
    const expiration = values.permanent ? null : fromDateTimeLocal(values.expiration);
    const sameExpiration = sameMinute(expiration, original.expiration);

    return {
        nick: nick === "" || nick === original.nick ? null : nick,
        reason: values.reason.trim() === original.reason ? null : values.reason.trim(),
        is_cheater: values.is_cheater === original.is_cheater ? null : values.is_cheater,
        expiration_mode: sameExpiration ? null : values.permanent ? "permanent" : "date",
        expiration: sameExpiration ? null : expiration,
    };
};

const useBanForm = (t: ITranslations, ban: AdminBan | null) => {
    const schema = useMemo(
        () =>
            createBanFormSchema({
                required: t("form.required"),
                nick: t("form.nick"),
                reason: t("form.reason"),
                date: t("form.date"),
            }),
        [t]
    );

    const form = useForm<BanFormValues>({
        mode: "onChange",
        resolver: zodResolver(schema) as Resolver<BanFormValues>,
        defaultValues: { nick: "", reason: "", is_cheater: false, permanent: true, expiration: "" },
    });

    const { reset } = form;
    useEffect(() => {
        if (ban) reset(toFormValues(ban.current));
    }, [ban, reset]);

    return form;
};

export { useBanForm };
