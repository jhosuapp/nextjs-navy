import { useQuery } from "@tanstack/react-query"
import { getBansAction } from "../actions";

const useBans = () => {
    const bansQuery = useQuery({
        queryKey: ['bans'],
        queryFn:  ()=> getBansAction(),
        staleTime: 60 * 1000 * 1000,
        refetchOnWindowFocus: false,
        retry: false,
    });

    return bansQuery
}

export { useBans }