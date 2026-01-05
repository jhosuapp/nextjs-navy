import { useQuery } from "@tanstack/react-query"
import { TierlistByModalitieArgs } from "../interfaces";
import { getTierlistByModalitieAction } from "../actions/get-tierlistByModalitie.action";

const useTierlistByModalitie = () => {
    const tierlistByModalitie = useQuery({
        queryKey: ['tierlistByModalitie'],
        queryFn:  ()=> getTierlistByModalitieAction(),
        staleTime: 60 * 1000 * 1000,
        refetchOnWindowFocus: false,
        retry: false,
    });

    return {
        tierlistByModalitie
    }
}

export { useTierlistByModalitie }