import { navyApi } from "@/shared/api";
import { LoginBody, LoginResponse } from "../interfaces";

const loginAction = async (body: LoginBody): Promise<LoginResponse> => {
    const { data } = await navyApi.post<LoginResponse>("/admin/login", body);
    return data;
};

export { loginAction };
