import { navyApi } from "@/shared/api";
import { UsernameBody } from "../interfaces/userName.interface";

const postUpdateUsernameAction = async(body: UsernameBody):Promise<any> => {
    const { data } = await navyApi.post<any>('/bot/username-update/', body);
  
    return data;
}


export { postUpdateUsernameAction }