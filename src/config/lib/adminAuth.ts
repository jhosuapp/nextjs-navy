import type { NextApiRequest } from "next";
import {
    createHmac,
    randomBytes,
    scryptSync,
    timingSafeEqual,
} from "crypto";
import { prisma } from "./prisma";

/**
 * Autenticación del panel admin.
 *
 * - Contraseñas: hash con scrypt (`salt:hashHex`), comparación timing-safe.
 * - Sesión: token firmado con HMAC-SHA256 (`body.signature`) guardado en una
 *   cookie httpOnly. No requiere dependencias externas (solo `crypto` de Node).
 */

export const SESSION_COOKIE = "navy_admin_session";

// Duración de la sesión: 8 horas.
const SESSION_TTL_SECONDS = 8 * 60 * 60;

const SCRYPT_KEYLEN = 64;

/** Roles del panel. `founder` puede además ver el registro de actividad. */
export const ADMIN_ROLES = ["admin", "founder"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

/** Lo que viaja firmado en la cookie. El rol NO va aquí: se lee de la BD. */
type SessionIdentity = {
    uid: number;
    username: string;
};

export type AdminSession = SessionIdentity & { role: AdminRole };

type SessionPayload = SessionIdentity & { exp: number };

const getSecret = (): string => {
    const secret = process.env.ADMIN_SESSION_SECRET;
    if (!secret || secret.length < 16) {
        throw new Error("ADMIN_SESSION_SECRET no está configurado");
    }
    return secret;
};

const base64urlEncode = (input: Buffer | string): string =>
    Buffer.from(input)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

const base64urlDecode = (input: string): Buffer =>
    Buffer.from(input.replace(/-/g, "+").replace(/_/g, "/"), "base64");

/** Genera `salt:hashHex` a partir de una contraseña en texto plano. */
export const hashPassword = (plain: string): string => {
    const salt = randomBytes(16).toString("hex");
    const hash = scryptSync(plain, salt, SCRYPT_KEYLEN).toString("hex");
    return `${salt}:${hash}`;
};

/** Compara una contraseña con el hash almacenado de forma timing-safe. */
export const verifyPassword = (plain: string, stored: string): boolean => {
    const [salt, hash] = stored.split(":");
    if (!salt || !hash) return false;

    const hashBuffer = new Uint8Array(Buffer.from(hash, "hex"));
    const computed = new Uint8Array(scryptSync(plain, salt, SCRYPT_KEYLEN));

    if (hashBuffer.length !== computed.length) return false;
    return timingSafeEqual(hashBuffer, computed);
};

const sign = (body: string): string =>
    base64urlEncode(createHmac("sha256", getSecret()).update(body).digest());

/** Crea un token de sesión firmado y con expiración. */
export const createSessionToken = (session: SessionIdentity): string => {
    const payload: SessionPayload = {
        ...session,
        exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
    };
    const body = base64urlEncode(JSON.stringify(payload));
    return `${body}.${sign(body)}`;
};

/** Verifica firma y expiración. Devuelve la sesión o null. */
export const verifySessionToken = (token: string): SessionIdentity | null => {
    try {
        const [body, signature] = token.split(".");
        if (!body || !signature) return null;

        const expected = new Uint8Array(Buffer.from(sign(body), "utf8"));
        const received = new Uint8Array(Buffer.from(signature, "utf8"));
        if (
            expected.length !== received.length ||
            !timingSafeEqual(expected, received)
        ) {
            return null;
        }

        const payload = JSON.parse(
            base64urlDecode(body).toString("utf8")
        ) as SessionPayload;

        if (
            typeof payload.exp !== "number" ||
            payload.exp * 1000 < Date.now()
        ) {
            return null;
        }

        return { uid: payload.uid, username: payload.username };
    } catch {
        return null;
    }
};

const cookieBase = (): string => {
    const secure = process.env.NODE_ENV === "production" ? " Secure;" : "";
    return `Path=/; HttpOnly; SameSite=Strict;${secure}`;
};

/** Header `Set-Cookie` para abrir la sesión. */
export const buildSessionCookie = (token: string): string =>
    `${SESSION_COOKIE}=${token}; ${cookieBase()} Max-Age=${SESSION_TTL_SECONDS}`;

/** Header `Set-Cookie` para cerrar la sesión. */
export const buildClearCookie = (): string =>
    `${SESSION_COOKIE}=; ${cookieBase()} Max-Age=0`;

/**
 * Lee y valida la sesión desde la cookie de la request.
 *
 * Además de firma y expiración, comprueba en `admin_users` que el usuario sigue
 * existiendo (mismo id y username): borrar o renombrar un admin revoca su
 * sesión al instante, sin tener que rotar `ADMIN_SESSION_SECRET`. Lo mismo al
 * desactivarlo (`disabled_at`). El rol se lee aquí también, así que dar o
 * quitar `founder` tiene efecto inmediato.
 */
export const requireAdmin = async (
    req: NextApiRequest
): Promise<AdminSession | null> => {
    const token = req.cookies[SESSION_COOKIE];
    if (!token) return null;

    const identity = verifySessionToken(token);
    if (!identity) return null;

    const user = await prisma.admin_users.findUnique({
        where: { id: identity.uid },
        select: { username: true, role: true, disabled_at: true },
    });

    if (user?.username !== identity.username || user.disabled_at) return null;

    const role: AdminRole = user.role === "founder" ? "founder" : "admin";
    return { ...identity, role };
};
