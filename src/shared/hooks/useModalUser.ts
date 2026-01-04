import { useEffect, useRef } from "react";
import { useModalStore, useSkinStore } from "../stores";
import { useUserByNameQuery } from "./useUserByNameQuery";
import { Id, toast } from "react-toastify";

const useModalUser = () => {
    const setShowModal = useModalStore(state => state.setShowModal);
    const username = useSkinStore(state => state.skin);
    const user = useUserByNameQuery({ username });
    const toastId = useRef<Id | null>(null);
    const info = user?.data?.data;
    const games = info?.games;


    useEffect(() => {
        if (user.isLoading && !toastId.current) {
            toastId.current = toast.loading('Searching user...');
        }
        
        if (!user.isLoading && toastId.current) {
            toast.dismiss(toastId.current);
            toastId.current = null;
        }
    }, [user.isLoading]);

    useEffect(()=>{
        if(user?.data?.data === null){
            toast.error('Error, player not found');
        }
    },[user.data]);

    return {
        setShowModal,
        username,
        user,
        info,
        games
    }
}

export { useModalUser }