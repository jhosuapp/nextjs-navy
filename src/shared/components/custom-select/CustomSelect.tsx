import { memo, useCallback, useEffect, useId, useRef, useState, type JSX, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import styles from './customSelect.module.css';

export type CustomSelectOption<T extends string> = {
    value: T;
    label: string;
};

type Props<T extends string> = {
    options: CustomSelectOption<T>[];
    /** `null` = sin selección (se muestra el placeholder). */
    value: T | null;
    onChange: (value: T) => void;
    placeholder: string;
    label: string;
    className?: string;
}

/**
 * Select propio (botón + listbox) con apertura animada. Sigue el patrón ARIA
 * "select-only combobox": flechas, Inicio/Fin, Enter/Espacio para elegir,
 * Escape o Tab para cerrar, y cierre al pulsar fuera.
 */
const CustomSelectInner = <T extends string>({ options, value, onChange, placeholder, label, className = '' }: Props<T>): JSX.Element => {
    const id = useId();
    const reduceMotion = useReducedMotion();
    const rootRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [activeIndex, setActiveIndex] = useState<number>(-1);

    const selectedIndex = options.findIndex((option) => option.value === value);
    const selected = selectedIndex >= 0 ? options[selectedIndex] : null;

    const open = useCallback(() => {
        setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
        setIsOpen(true);
    }, [selectedIndex]);

    const close = useCallback(() => setIsOpen(false), []);

    const choose = useCallback((index: number) => {
        const option = options[index];
        if (option) onChange(option.value);
        setIsOpen(false);
    }, [options, onChange]);

    // Cierre al pulsar fuera.
    useEffect(() => {
        if (!isOpen) return;
        const onPointerDown = (event: PointerEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
        };
        document.addEventListener('pointerdown', onPointerDown);
        return () => document.removeEventListener('pointerdown', onPointerDown);
    }, [isOpen]);

    // Mantiene visible la opción activa al navegar con teclado.
    useEffect(() => {
        if (!isOpen || activeIndex < 0) return;
        listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)?.scrollIntoView({ block: 'nearest' });
    }, [isOpen, activeIndex]);

    const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
        const last = options.length - 1;
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                if (!isOpen) open();
                else setActiveIndex((index) => Math.min(last, index + 1));
                break;
            case 'ArrowUp':
                event.preventDefault();
                if (!isOpen) open();
                else setActiveIndex((index) => Math.max(0, index - 1));
                break;
            case 'Home':
                if (isOpen) { event.preventDefault(); setActiveIndex(0); }
                break;
            case 'End':
                if (isOpen) { event.preventDefault(); setActiveIndex(last); }
                break;
            case 'Enter':
            case ' ':
                event.preventDefault();
                if (isOpen) choose(activeIndex);
                else open();
                break;
            case 'Escape':
                if (isOpen) { event.preventDefault(); close(); }
                break;
            case 'Tab':
                close();
                break;
        }
    };

    const listboxId = `${id}-listbox`;
    const optionId = (index: number) => `${id}-option-${index}`;

    return (
        <div ref={ rootRef } className={ `${styles.customSelect} ${className}` }>
            <button
                type="button"
                role="combobox"
                aria-label={ label }
                aria-haspopup="listbox"
                aria-expanded={ isOpen }
                aria-controls={ listboxId }
                aria-activedescendant={ isOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined }
                className={ `${styles.customSelect__trigger} ${selected ? styles.customSelect__trigger__selected : ''} ${isOpen ? styles.customSelect__trigger__open : ''}` }
                onClick={ () => (isOpen ? close() : open()) }
                onKeyDown={ onKeyDown }
            >
                <span className={ styles.customSelect__value }>{ selected?.label ?? placeholder }</span>
                <motion.svg
                    className={ styles.customSelect__chevron }
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.2 }}
                >
                    <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </motion.svg>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.ul
                        ref={ listRef }
                        id={ listboxId }
                        role="listbox"
                        aria-label={ label }
                        className={ styles.customSelect__list }
                        initial={ reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 } }
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={ reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.98 } }
                        transition={{ duration: 0.16, ease: 'easeOut' }}
                    >
                        {options.map((option, index) => (
                            <li
                                key={ option.value }
                                id={ optionId(index) }
                                data-index={ index }
                                role="option"
                                aria-selected={ option.value === value }
                                className={ `${styles.customSelect__option} ${index === activeIndex ? styles.customSelect__option__active : ''}` }
                                onPointerEnter={ () => setActiveIndex(index) }
                                onClick={ () => choose(index) }
                            >
                                { option.label }
                                {option.value === value && (
                                    <svg className={ styles.customSelect__check } viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M20 6 9 17l-5-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
};

// `memo` pierde el genérico: se re-tipa para conservar `T`.
const CustomSelect = memo(CustomSelectInner) as typeof CustomSelectInner & { displayName?: string };
CustomSelect.displayName = 'CustomSelect';

export { CustomSelect }
