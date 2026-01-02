import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { getTierlistOverallAction } from "../actions/get-tierlistOverall.action";

const useTierlistOverall = () => {
    const tierlistOverallQuery = useInfiniteQuery({
        queryKey: ['tierlist', 'infinite'],
        queryFn: ({ pageParam = 1, queryKey })=> {
            return getTierlistOverallAction(pageParam as number);
        },
        staleTime: 60 * 1000,
        refetchOnWindowFocus: true,
        retry: false,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (lastPage.page >= lastPage.totalPages) return undefined
      
            return lastPage.page + 1
        },
    });

    return tierlistOverallQuery
}

export { useTierlistOverall }