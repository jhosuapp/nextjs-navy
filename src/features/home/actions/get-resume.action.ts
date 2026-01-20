import { navyApi } from "@/shared/api";
import { TierlistResumeResponse } from "../interfaces";

const getResumeAction = async ():Promise<TierlistResumeResponse> => {
    const { data } = await navyApi.get<TierlistResumeResponse>('/tierlist/resume');

    return data;
}

export { getResumeAction }