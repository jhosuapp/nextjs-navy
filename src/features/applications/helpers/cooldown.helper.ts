/** Días que deben pasar antes de poder volver a postularse al mismo rol. */
export const COOLDOWN_DAYS = 14;

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

export const COOLDOWN_MS = COOLDOWN_DAYS * DAY_MS;

export type CooldownInfo = {
    /** Fecha ISO a partir de la cual se puede volver a postular. */
    availableAt: string;
    /** Días completos restantes, redondeados hacia arriba (>= 1). */
    daysRemaining: number;
    /** Horas restantes, redondeadas hacia arriba (>= 1). */
    hoursRemaining: number;
};

/**
 * Calcula cuánto falta para poder volver a postularse.
 * Devuelve `null` si nunca se postuló o si el plazo ya se cumplió.
 */
export const getCooldown = (
    lastAt: Date | null | undefined,
    now: Date = new Date()
): CooldownInfo | null => {
    if (!lastAt) return null;

    const availableAt = new Date(lastAt.getTime() + COOLDOWN_MS);
    const remaining = availableAt.getTime() - now.getTime();

    if (remaining <= 0) return null;

    return {
        availableAt: availableAt.toISOString(),
        daysRemaining: Math.ceil(remaining / DAY_MS),
        hoursRemaining: Math.ceil(remaining / HOUR_MS),
    };
};
