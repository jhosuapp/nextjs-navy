import { useQuery } from "@tanstack/react-query"
import { getBansAction } from "../actions";

const useBansQuery = () => {
    const bansQuery = useQuery({
        queryKey: ['bans'],
        queryFn:  ()=> getBansAction(),
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        retry: false,
    });

    return bansQuery
}

export { useBansQuery }