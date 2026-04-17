import { useRef, useState, useEffect, type JSX } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import styles from './languageSwitcher.module.css';

const LANGUAGES = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
];

const LanguageSwitcher = (): JSX.Element => {
    const { i18n } = useTranslation();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const current = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];
    const options = LANGUAGES.filter((l) => l.code !== current.code);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target as Node)) {
            setOpen(false);
        }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (code: string) => {
        i18n.changeLanguage(code);
        router.push(router.asPath, router.asPath, { locale: code });
        setOpen(false);
    };

    const handlePrefetch = (code: string) => {
        if (!i18n.hasResourceBundle(code, "translation")) {
            i18n.loadLanguages(code);
        }
    };

    return (
        <div ref={ref} className={styles.langSwitch}>
            <button
                onClick={() => setOpen((prev) => !prev)}
                className={styles.langSwitch__current}
            >
                {current.label}
                <svg
                    className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
                    viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"
                >
                    <path d="M2 4l4 4 4-4" />
                </svg>
            </button>

            {open && (
                <div className={styles.langSwitch__wrapper}>
                    {options.map(({ code, label }) => (
                        <button
                            key={code}
                            onClick={() => handleSelect(code)}
                            onMouseEnter={() => handlePrefetch(code)}
                        >
                            <Image src={`/images/icon-${label}.svg`} width={24} height={24} alt={ `Lenguaje ${label}` } />
                            {label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export { LanguageSwitcher };