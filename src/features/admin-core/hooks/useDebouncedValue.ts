import { useEffect, useState } from "react";

/** Devuelve `value` tras `delay` ms sin cambios (búsquedas contra la API). */
const useDebouncedValue = <T,>(value: T, delay = 350): T => {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(id);
    }, [value, delay]);

    return debounced;
};

export { useDebouncedValue };
