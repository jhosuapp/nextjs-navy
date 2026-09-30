import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { searchSpotifyAction } from "../actions";

const DEBOUNCE_MS = 350;
const MIN_QUERY = 2;

/**
 * Búsqueda de canciones con debounce: solo consulta cuando se deja de escribir
 * (el rate limit del panel es por IP) y cachea cada término 5 minutos.
 */
const useSpotifySearch = (query: string) => {
    const [debounced, setDebounced] = useState(query.trim());

    useEffect(() => {
        const timeout = setTimeout(() => setDebounced(query.trim()), DEBOUNCE_MS);
        return () => clearTimeout(timeout);
    }, [query]);

    const isEnabled = debounced.length >= MIN_QUERY;

    const searchQuery = useQuery({
        queryKey: ["admin-spotify-search", debounced.toLowerCase()],
        queryFn: ({ signal }) => searchSpotifyAction(debounced, signal),
        enabled: isEnabled,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
        retry: false,
    });

    return {
        results: isEnabled ? searchQuery.data?.data ?? [] : [],
        isSearching: isEnabled && searchQuery.isFetching,
        isError: isEnabled && searchQuery.isError,
        hasQuery: isEnabled,
        isTyping: query.trim() !== debounced,
    };
};

export { useSpotifySearch };
