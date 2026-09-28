import { navyApi } from "@/shared/api";

const logoutAction = async (): Promise<void> => {
    await navyApi.post("/admin/logout");
};

export { logoutAction };
