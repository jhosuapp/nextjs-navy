/**
 * Reglas compartidas entre los formularios del panel admin (cliente) y la
 * validación de las API routes (servidor).
 */
export const ADMIN_RULES = {
    nickRegex: /^[A-Za-z0-9_]{3,16}$/,
    colourRegex: /^#[0-9A-Fa-f]{6}$/,
    roleNameMax: 64,
    roleWeightMin: -1000,
    roleWeightMax: 100000,
    reasonMax: 2000,
    hiddenReasonMax: 255,
    searchMax: 32,
    passwordMin: 8,
    passwordMax: 200,
} as const;

export const ADMIN_PAGE_SIZE = 20;
