import { useRef, useState } from "react";
import { useModalStore, useSkinStore } from "@/shared/stores";

const userNavBar = () => {
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

export { userNavBar }