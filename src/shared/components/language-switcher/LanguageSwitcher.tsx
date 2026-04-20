import { useRef, useState, useEffect, type JSX } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { AnimatePresence, motion } from 'framer-motion';
import styles from './languageSwitcher.module.css';
import { fadeInMotion } from "@/shared/motion/fadeIn.motion";

const LANGUAGES = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
  { code: "pt", label: "PT" },
];

type Props = {
    hasMobileStyle?: boolean;
    isHeaderOpen?: boolean;
}

const LanguageSwitcher = ({ hasMobileStyle = false, isHeaderOpen = false }:Props): JSX.Element => {
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
        <div ref={ref} className={`${styles.langSwitch} ${hasMobileStyle ? styles.langSwitchMobile : ''} ${open ? styles.langSwitchOpen : ''}`}>
            <button
                onClick={() => setOpen((prev) => !prev)}
                className={`${styles.langSwitch__current} ${isHeaderOpen ? styles.langSwitch__currentOpen : ''}`}
            >
                {current.label}
                {hasMobileStyle ? (
                    <div className="relative w-6 h-4">
                        <Image
                            src={`/images/icon-${current.label}.svg`}
                            alt={current.label}
                            sizes="24px"
                            fill
                        />
                    </div>
                ) : (
                    <svg
                        className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
                        viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"
                    >
                        <path d="M2 4l4 4 4-4" />
                    </svg>
                )}
            </button>

            <AnimatePresence mode="wait">
                {open && (
                    <motion.div className={styles.langSwitch__wrapper} {...fadeInMotion(0,0)} key={`wrapper-switch-${open}`}>
                        {options.map(({ code, label }) => (
                            <button
                                key={code}
                                onClick={() => handleSelect(code)}
                                onMouseEnter={() => handlePrefetch(code)}
                                className={`${isHeaderOpen ? styles.langSwitch__currentOpen : ''}`}
                            >
                                <Image src={`/images/icon-${label}.svg`} width={24} height={24} alt={ `Lenguaje ${label}` } />
                                {label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export { LanguageSwitcher };