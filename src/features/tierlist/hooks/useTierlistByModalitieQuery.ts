import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { TierlistByModalitieArgs } from "../interfaces";
import { getTierlistByModalitieAction, getTierlistByModalitieAndTierAction } from "../actions/get-tierlistByModalitie.action";

const useTierlistByModalitie = () => {
    const tierlistByModalitie = useQuery({
        queryKey: ['tierlistByModalitie'],
        queryFn:  ()=> getTierlistByModalitieAction(),
        staleTime: 60 * 1000 * 1000,
        refetchOnWindowFocus: false,
        retry: false,
    });

    return tierlistByModalitie
}

const useTierlistByModalitieAndTier = ({ game, tier, enabled }: TierlistByModalitieArgs & { enabled: boolean }) => {
    const tierlistByModalitieAndTier = useInfiniteQuery({
        queryKey: ['tierlistByModalitieAndTier', game, tier],
        queryFn: ({ pageParam = 1 }) => {
            return getTierlistByModalitieAndTierAction({ 
                game, 
                tier, 
                page: pageParam 
            });
        },
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        retry: false,
        initialPageParam: 1,
        enabled: !!game && !!tier && !!enabled,
        getNextPageParam: (lastPage) => {
            if (lastPage.page >= lastPage.totalPages) return undefined;
            return lastPage.page + 1;
        },
    });

    return tierlistByModalitieAndTier
}

export { useTierlistByModalitie, useTierlistByModalitieAndTier }