import { navyApi } from "@/shared/api";
import { TierlistByModalitieArgs, TierlistByModalitieResponse } from "../interfaces";

const getTierlistByModalitieAction = async ({ game, tier, page }:TierlistByModalitieArgs = {}):Promise<TierlistByModalitieResponse> => {
    const { data } = await navyApi.get<TierlistByModalitieResponse>(`/tierlist/filter-by-modalitie`, {
        params: {
            game,
            tier,
            page,
        }
    });

    return data;
}

export { getTierlistByModalitieAction }