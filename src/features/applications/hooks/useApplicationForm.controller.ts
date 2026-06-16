import { useMemo } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { ITranslations } from "@/shared/interfaces/globals";
import { useApplicationFormQuery } from "./useApplicationForm.query";
import {
    ApplicationFormInterface,
    ApplicationMessages,
    createApplicationSchema,
} from "../validations/application-form.validation";

type Props = {
    t: ITranslations;
};

const useApplicationFormController = ({ t }: Props) => {
    const mutation = useApplicationFormQuery();

    const messages = useMemo<ApplicationMessages>(
        () => ({
            required: t("validation.required"),
            nombreLength: t("validation.nombreLength"),
            discord: t("validation.discord"),
            edad: t("validation.edad"),
            tooShort: t("validation.tooShort"),
            tooLong: t("validation.tooLong"),
            selectRequired: t("validation.selectRequired"),
            detailRequired: t("validation.detailRequired"),
            tipoRequired: t("validation.tipoRequired"),
        }),
        [t]
    );

    const schema = useMemo(() => createApplicationSchema(messages), [messages]);

    const {
        control,
        handleSubmit,
        watch,
        reset,
        trigger,
        formState: { errors },
    } = useForm<ApplicationFormInterface>({
        mode: "onChange",
        resolver: zodResolver(schema) as Resolver<ApplicationFormInterface>,
        defaultValues: {
            nombre: "",
            discord: "",
            labor_helper: "",
            funciones_helper: "",
            detalle_spam: "",
            detalle_flood: "",
            detalle_hacks_ss: "",
            opinion_tierlist: "",
            usuarios_peleando: "",
            testers_peleando: "",
            ticket_tester: "",
            ticket_reporte: "",
            hacks_pvp: "",
            meta_principal: "",
            website: "",
        },
    });

    const onSubmit = async (formData: ApplicationFormInterface) => {
        const toastId = toast.loading(t("feedback.loading"));
        try {
            await mutation.mutateAsync(formData);
            toast.update(toastId, {
                render: t("feedback.success"),
                type: "success",
                isLoading: false,
                autoClose: 4000,
            });
            reset();
        } catch (error) {
            let message = t("feedback.errorUnexpected");
            if (error instanceof AxiosError) {
                const status = error.response?.status;
                if (status === 429) message = t("feedback.errorThrottle");
                else if (status === 409) message = t("feedback.errorDuplicated");
                else if (status === 400) message = t("feedback.errorValidation");
            }
            toast.update(toastId, {
                render: message,
                type: "error",
                isLoading: false,
                autoClose: 5000,
            });
        }
    };

    return {
        control,
        errors,
        watch,
        trigger,
        handleSubmit,
        onSubmit,
        mutation,
    };
};

export { useApplicationFormController };
