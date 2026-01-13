import { navyApi } from "@/shared/api";
import { BansResponse } from "../interfaces";

const getBansAction = async ():Promise<BansResponse> => {
    const { data } = await navyApi.get<BansResponse>('/bans');

    return data;
}

export { getBansAction }