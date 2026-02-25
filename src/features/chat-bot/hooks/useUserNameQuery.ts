import { useQuery } from "@tanstack/react-query"
import { getUserNameAction } from "../actions/get-username.action";

const useUserNameQuery = (uuid:string) => {
    const userNameQuery = useQuery({
        queryKey: ['bans', uuid],
        queryFn:  ()=> getUserNameAction(uuid),
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        retry: false,
        enabled: !!uuid
    });

    return userNameQuery
}

export { useUserNameQuery }