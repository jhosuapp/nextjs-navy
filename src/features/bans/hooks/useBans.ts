import { useTranslation } from "react-i18next";
import { useLoadMore } from "./useLoadMore";
import { useBansQuery } from "./useBansQuery";
import { anchorScroll } from "@/shared/helpers";
import { useLenisStore } from "@/shared/stores/lenis.store";
import { useSearchStore } from "@/shared/stores/search.store";

const useBansController = () => {
    const response = useBansQuery();
    const { t } = useTranslation("bans");
    const value = useSearchStore(state => state.value);

    const activeBans = response?.data?.active ?? [];
    const inactiveBans = response?.data?.inactive ?? [];

    const filterBySearch = (items: any[]) => {
        if (!value.trim()) return items;
        const search = value.toLowerCase();
        return items.filter(item =>
            item.nick?.toLowerCase().includes(search)
        );
    };

    const filteredActiveBans = filterBySearch(activeBans);
    const filteredInactiveBans = filterBySearch(inactiveBans);

    const activeBansPaginated = useLoadMore(filteredActiveBans, 3);
    const inactiveBansPaginated = useLoadMore(filteredInactiveBans, 3);
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
        inactiveBansPaginated.loadMore(); 
        anchorScroll(lenis);
    };

    return {
        response, 
        t,
        inactiveBans: filteredInactiveBans,
        activeBans: filteredActiveBans,
        getDuration,
        handleLoadMoreActive,
        handleLoadMoreInactive,
        activeBansPaginated,
        inactiveBansPaginated, 
        value
    }
}

export { useBansController }