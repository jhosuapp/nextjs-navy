import { useQuery } from "@tanstack/react-query"
import { getResumeAction } from "../actions";

const useResumeQuery = () => {
    const resumeQuery = useQuery({
        queryKey: ['resumeHome'],
        queryFn:  ()=> getResumeAction(),
        staleTime: 60 * 1000 * 1000,
        refetchOnWindowFocus: false,
        retry: false,
    });

    return resumeQuery
}

export { useResumeQuery }