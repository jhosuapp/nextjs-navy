import { TierlistUser } from "@/features/tierlist/interfaces";
import { navyApi } from "@/shared/api";

const getUserByNameAction = async (username: string):Promise<{data: TierlistUser}> => {
    const { data } = await navyApi.get<{data: TierlistUser}>(`/tierlist/overall?nick=${username}`);

    return data;
}

export { getUserByNameAction }