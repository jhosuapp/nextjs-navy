import { useQuery } from "@tanstack/react-query"
import { getUserByNameAction } from "../actions";

type Props = {
    username: string;
}

const useUserByNameQuery = ({ username }:Props) => {
    const userByNameQuery = useQuery({
        queryKey: ['userByName', username],
        queryFn:  ()=> getUserByNameAction(username),
        staleTime: 60 * 1000 * 1000 * 1000,
        refetchOnWindowFocus: false,
        retry: false,
    });

    return userByNameQuery;
}

export { useUserByNameQuery }