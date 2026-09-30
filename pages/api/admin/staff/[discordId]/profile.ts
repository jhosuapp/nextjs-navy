import { Prisma } from "@prisma/client";
import { prisma } from "@/config/lib/prisma";
import { createAdminHandler, queryString } from "@/config/lib/adminHandler";
import { refreshAfterChange } from "@/config/lib/adminRevalidate";
import { saveStaffProfile, StaffProfilePatch } from "@/config/lib/staffProfiles";
import { getSpotifyTrack, SpotifyNotConfiguredError } from "@/config/lib/spotify";
import { staffProfilePatchSchema } from "@/config/lib/adminValidation";

export default createAdminHandler("staff/[discordId]/profile", {
    PATCH: async (req, res, session) => {
        const discordId = queryString(req.query.discordId);
        if (!/^[\w-]{1,32}$/.test(discordId)) {
            return void res.status(400).json({ message: "Identificador inválido" });
        }

        const parsed = staffProfilePatchSchema.safeParse(req.body);
        if (!parsed.success) {
            return void res.status(400).json({ message: "Datos inválidos" });
        }

        const exists = await prisma.staff.findUnique({ where: { discord_id: discordId } });
        if (!exists) {
            return void res.status(404).json({ message: "Miembro no encontrado" });
        }

        const { spotify_track_id: trackId, ...fields } = parsed.data;
        const patch: StaffProfilePatch = { ...fields };

        // La canción se guarda con metadatos resueltos aquí, nunca los del cliente.
        if (trackId === null) {
            Object.assign(patch, { spotify_track_id: null, spotify_title: null, spotify_artist: null, spotify_cover: null });
        } else if (trackId !== undefined) {
            try {
                const track = await getSpotifyTrack(trackId);
                if (!track) return void res.status(400).json({ message: "Canción no encontrada en Spotify" });
                Object.assign(patch, {
                    spotify_track_id: track.id,
                    spotify_title: track.title.slice(0, 200),
                    spotify_artist: track.artist.slice(0, 200),
                    spotify_cover: track.cover?.startsWith("https://i.scdn.co/") ? track.cover : null,
                });
            } catch (error) {
                if (error instanceof SpotifyNotConfiguredError) {
                    return void res.status(503).json({ message: error.message });
                }
                console.error("[api/admin/staff/profile] Spotify lookup failed:", error);
                return void res.status(502).json({ message: "No se pudo consultar Spotify" });
            }
        }

        try {
            await saveStaffProfile(discordId, patch, session.username);
        } catch (error) {
            // P2021 = la tabla no existe: falta aplicar la migración manual.
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021") {
                return void res.status(503).json({
                    message: "Falta la tabla staff_profiles: aplica prisma/manual-migrations/2026-09-30-staff-profiles.sql",
                });
            }
            throw error;
        }
        await refreshAfterChange(res, ["staff"]);

        res.status(200).json({ message: "Perfil actualizado" });
    },
});
