import { useEffect, useRef } from "react";
import { useModalStore } from "../stores/modal.store";
import { useSkinStore } from "../stores/skin.store";
import { useUserByNameQuery } from "./useUserByNameQuery";
import { Id, toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const useModalUser = () => {
    const { t } = useTranslation("common");
    const setShowModal = useModalStore(state => state.setShowModal);
    const username = useSkinStore(state => state.skin);
    const user = useUserByNameQuery({ username });
    const toastId = useRef<Id | null>(null);
    const info = user?.data?.data;
    const games = info?.games;


    useEffect(() => {
        if (user.isLoading && !toastId.current) {
            toastId.current = toast.loading(t('modal.searching'));
        }
        
        if (!user.isLoading && toastId.current) {
            toast.dismiss(toastId.current);
            toastId.current = null;
        }
    }, [user.isLoading]);

    useEffect(()=>{
        if(user?.data?.data === null){
            toast.error(t('modal.error'));
            setShowModal(false);
        }
    },[user.data]);

    return {
        setShowModal,
        username,
        user,
        info,
        games,
        t
    }
}

export { useModalUser }