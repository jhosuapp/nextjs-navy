import { useQuery } from "@tanstack/react-query"
import { getStaffAction } from "../actions";

const useStaff = () => {
    const staffQuery = useQuery({
        queryKey: ['staff'],
        queryFn:  ()=> getStaffAction(),
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        retry: false,
    });

    return staffQuery
}

export { useStaff }