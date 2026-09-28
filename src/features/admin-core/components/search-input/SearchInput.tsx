import { memo, useId, type JSX } from "react";
import { CloseIcon, SearchIcon } from "@/config/assets/icon/admin/AdminIcons";
import styles from "./searchInput.module.css";

type Props = {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    clearLabel: string;
    maxLength?: number;
};

const SearchInput = memo(
    ({ value, onChange, placeholder, clearLabel, maxLength = 32 }: Props): JSX.Element => {
        const id = useId();

        return (
            <div className={styles.searchInput}>
                <label htmlFor={id} className="sr-only">
                    {placeholder}
                </label>
                <SearchIcon className={styles.searchInput__icon} size={18} />
                <input
                    id={id}
                    type="search"
                    className={styles.searchInput__field}
                    value={value}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    autoComplete="off"
                    spellCheck={false}
                    onChange={(event) => onChange(event.target.value)}
                />
                {value && (
                    <button
                        type="button"
                        className={styles.searchInput__clear}
                        aria-label={clearLabel}
                        onClick={() => onChange("")}
                    >
                        <CloseIcon size={16} />
                    </button>
                )}
            </div>
        );
    }
);

SearchInput.displayName = "SearchInput";

export { SearchInput };
