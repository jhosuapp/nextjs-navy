import { useTranslation } from "next-i18next";
import { useLoadMore } from "./useLoadMore";
import { anchorScroll } from "@/shared/helpers";
import { useLenisStore } from "@/shared/stores/lenis.store";
import { useSearchStore } from "@/shared/stores/search.store";
import { BansResponse, Punishment } from "../interfaces";

const useBansController = (initialData: BansResponse) => {
    const { t } = useTranslation("bans");
    const value = useSearchStore(state => state.value);

    const activeBans = initialData.active;
    const inactiveBans = initialData.inactive;

    const filterBySearch = (items: Punishment[]) => {
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
