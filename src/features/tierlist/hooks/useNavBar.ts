import { useRef, useState } from "react";
import { useModalStore } from "@/shared/stores/modal.store";
import { useSkinStore } from "@/shared/stores/skin.store";

const useNavBar = () => {
    const formRef = useRef<HTMLFormElement>(null);
    const setShowModal = useModalStore(state => state.setShowModal);
    const setSkin = useSkinStore(state => state.setSkin);
    const [value, setValue] = useState<string>('');

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSkin(value);
        setShowModal(true);
        setValue('');
    }

    return {
        setValue,
        value,
        onSubmit,
        formRef
    }
}

export { useNavBar }