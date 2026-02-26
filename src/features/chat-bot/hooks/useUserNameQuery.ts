import { useMutation, useQuery } from "@tanstack/react-query"
import { getUserNameAction } from "../actions/get-username.action";
import { UsernameBody } from "../interfaces/userName.interface";
import { postUpdateUsernameAction } from "../actions/post-updateUsername.action";

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

const useUpdateUsernameMutation = () => {
    const usageMutation = useMutation({
        mutationFn: (body: UsernameBody) => postUpdateUsernameAction(body),
    });

    return usageMutation;
};

export { useUserNameQuery, useUpdateUsernameMutation }