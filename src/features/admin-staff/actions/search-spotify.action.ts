import { navyApi } from "@/shared/api";
import { SpotifySearchResponse } from "../interfaces";

const searchSpotifyAction = async (query: string, signal?: AbortSignal): Promise<SpotifySearchResponse> => {
    const { data } = await navyApi.get<SpotifySearchResponse>("/admin/spotify/search", { params: { q: query }, signal });
    return data;
};

export { searchSpotifyAction };
