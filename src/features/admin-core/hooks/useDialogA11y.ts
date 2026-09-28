import { useEffect, useRef, type RefObject } from "react";
import { useLenisStore } from "@/shared/stores/lenis.store";

const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accesibilidad de diálogos/drawers: cierra con Escape, atrapa el foco dentro,
 * pausa el smooth-scroll de Lenis y devuelve el foco al disparador al cerrar.
 */
const useDialogA11y = (
    isOpen: boolean,
    onClose: () => void,
    panelRef: RefObject<HTMLElement | null>
): void => {
    const lenis = useLenisStore((state) => state.lenis);
    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        if (!isOpen) return;

        const previouslyFocused = document.activeElement as HTMLElement | null;
        lenis?.stop();

        // Foco inicial: primer campo o, si no hay, el propio panel.
        const frame = requestAnimationFrame(() => {
            const panel = panelRef.current;
            const first = panel?.querySelector<HTMLElement>(
                "input:not([disabled]), textarea:not([disabled]), select:not([disabled])"
            );
            (first ?? panel)?.focus();
        });

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.stopPropagation();
                onCloseRef.current();
                return;
            }
            if (event.key !== "Tab" || !panelRef.current) return;

            const focusables = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
            if (focusables.length === 0) return;

            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", onKeyDown);

        return () => {
            cancelAnimationFrame(frame);
            document.removeEventListener("keydown", onKeyDown);
            lenis?.start();
            previouslyFocused?.focus?.();
        };
    }, [isOpen, lenis, panelRef]);
};

export { useDialogA11y };
