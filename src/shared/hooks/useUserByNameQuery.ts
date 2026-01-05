import { useQuery } from "@tanstack/react-query"
import { getUserByNameAction } from "../actions";
import { useModalStore } from "../stores";

type Props = {
    username: string;
}

const useUserByNameQuery = ({ username }:Props) => {
    const showModal = useModalStore(state => state.showModal);

    const userByNameQuery = useQuery({
        queryKey: ['userByName', username],
        queryFn:  ()=> getUserByNameAction(username),
        staleTime: 60 * 1000 * 1000 * 1000,
        refetchOnWindowFocus: false,
        retry: false,
        enabled: showModal
    });

    return userByNameQuery;
}

export { useUserByNameQuery }