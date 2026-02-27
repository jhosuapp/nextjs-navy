import { navyApi } from "@/shared/api";
import { TierlistOverallResponse } from "../interfaces";

const getTierlistOverallAction = async (page: number):Promise<TierlistOverallResponse> => {
    const { data } = await navyApi.get<TierlistOverallResponse>(`/tierlist/overall-upd?page=${page}`);

    return data;
}

export { getTierlistOverallAction }