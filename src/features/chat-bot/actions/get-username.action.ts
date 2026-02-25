import { navyApi } from "@/shared/api";
import { UserNameResponse } from "../interfaces/userName.interface";

const getUserNameAction = async (uuid: string):Promise<UserNameResponse> => {
    const { data } = await navyApi.get<UserNameResponse>(`/bot/username/?uuid=${uuid}`);

    return data;
}

export { getUserNameAction }