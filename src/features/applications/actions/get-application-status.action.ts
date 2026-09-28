import { navyApi } from "@/shared/api";
import { CooldownInfo } from "../helpers";

export type ApplicationStatusResponse =
    | { canApply: true }
    | ({ canApply: false } & CooldownInfo);

const getApplicationStatusAction = async (
    discord: string,
    tipo: string
): Promise<ApplicationStatusResponse> => {
    const { data } = await navyApi.get<ApplicationStatusResponse>(
        "/applications/status",
        { params: { discord, tipo } }
    );
    return data;
};

export { getApplicationStatusAction };
