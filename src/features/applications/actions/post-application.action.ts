import { navyApi } from "@/shared/api";
import { ApplicationFormInterface } from "../validations/application-form.validation";

type ApplicationResponse = {
    message: string;
};

const postApplicationAction = async (
    body: ApplicationFormInterface
): Promise<ApplicationResponse> => {
    const { data } = await navyApi.post<ApplicationResponse>("/applications", body);
    return data;
};

export { postApplicationAction };
