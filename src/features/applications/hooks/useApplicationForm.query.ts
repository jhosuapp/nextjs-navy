import { useMutation } from "@tanstack/react-query";
import { postApplicationAction } from "../actions/post-application.action";
import { ApplicationFormInterface } from "../validations/application-form.validation";

const useApplicationFormQuery = () => {
    const usageMutation = useMutation({
        mutationFn: (body: ApplicationFormInterface) => postApplicationAction(body),
    });

    return usageMutation;
};

export { useApplicationFormQuery };
