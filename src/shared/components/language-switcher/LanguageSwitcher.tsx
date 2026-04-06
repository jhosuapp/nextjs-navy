import { useTranslation } from "react-i18next";

const LANGUAGES = [
    { code: "es", label: "ES" },
    { code: "en", label: "EN" },
    { code: "pt", label: "PT" },
];

const LanguageSwitcher = ():JSX.Element => {
    const { i18n } = useTranslation();

    return (
        <div className="flex gap-2">
            {LANGUAGES.map(({ code, label }) => (
                <button
                    key={code}
                    onClick={() => i18n.changeLanguage(code)}
                    className={i18n.language === code ? "active" : ""}
                >
                    {label}
                </button>
            ))}
        </div>
    );
};

export { LanguageSwitcher }