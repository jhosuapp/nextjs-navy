import { useLoadMore } from "./useLoadMore";
import { useBansQuery } from "./useBansQuery";
import { anchorScroll } from "@/shared/helpers";
import { useLenisStore } from "@/shared/stores";

const useBansController = () => {
    const response = useBansQuery();
    const activeBans = response?.data?.active ?? [];
    const inactiveBans = response?.data?.inactive ?? [];
    const activeBansPaginated = useLoadMore(activeBans, 6);
    const inactiveBansPaginated = useLoadMore(inactiveBans, 6);
    const lenis = useLenisStore(state => state.lenis);

    const getDuration = (index: number) => {
        const baseDuration = 0.15;   
        const batchIndex = index % 6;
        return Math.min(0.15 + batchIndex * baseDuration, 1);
    };

    const handleLoadMoreActive = () => {
        activeBansPaginated.loadMore();
        anchorScroll(lenis);
    };

    const handleLoadMoreInactive = () => {
        activeBansPaginated.loadMore();
        anchorScroll(lenis);
    };

    return {
        response, 
        inactiveBans,
        activeBans,
        getDuration,
        handleLoadMoreActive,
        handleLoadMoreInactive,
        activeBansPaginated,
        inactiveBansPaginated
    }
}

export { useBansController }