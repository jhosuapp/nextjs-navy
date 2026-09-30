import { createAdminHandler, queryString } from "@/config/lib/adminHandler";
import { searchSpotifyTracks, SpotifyNotConfiguredError } from "@/config/lib/spotify";
import type { SpotifySearchResponse } from "@/features/admin-staff/interfaces";

const QUERY_MAX = 80;

// Búsqueda de canciones para el perfil de staff. La clave de Spotify vive en el
// servidor; el panel solo ve los resultados.
export default createAdminHandler("spotify/search", {
    GET: async (req, res) => {
        const query = queryString(req.query.q).trim().slice(0, QUERY_MAX);
        if (query.length < 2) {
            return void res.status(400).json({ message: "Búsqueda demasiado corta" });
        }

        try {
            const body: SpotifySearchResponse = { data: await searchSpotifyTracks(query) };
            res.setHeader("Cache-Control", "private, max-age=300");
            res.status(200).json(body);
        } catch (error) {
            if (error instanceof SpotifyNotConfiguredError) {
                return void res.status(503).json({ message: error.message });
            }
            console.error("[api/admin/spotify/search] GET failed:", error);
            res.status(502).json({ message: "No se pudo consultar Spotify" });
        }
    },
});
