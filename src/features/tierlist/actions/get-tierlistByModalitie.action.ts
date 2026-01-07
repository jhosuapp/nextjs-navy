import { navyApi } from "@/shared/api";
import { TierlistByGamePaginatedResponse, TierlistByGameSummaryResponse, TierlistByModalitieArgs } from "../interfaces";

const getTierlistByModalitieAction = async ():Promise<TierlistByGameSummaryResponse> => {
    const { data } = await navyApi.get<TierlistByGameSummaryResponse>('/tierlist/filter-by-modalitie');

    return data;
}

const getTierlistByModalitieAndTierAction = async ({ game, tier, page }:TierlistByModalitieArgs = {}):Promise<TierlistByGamePaginatedResponse> => {
    const { data } = await navyApi.get<TierlistByGamePaginatedResponse>(`/tierlist/filter-by-modalitie`, {
        params: {
            game,
            tier,
            page,
        }
    });

    return data;
}

export { getTierlistByModalitieAction, getTierlistByModalitieAndTierAction }