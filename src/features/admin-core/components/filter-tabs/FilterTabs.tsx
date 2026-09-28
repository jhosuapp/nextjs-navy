import { memo, type JSX } from "react";
import { cn } from "@/shared/helpers/cn";
import styles from "./filterTabs.module.css";

export type FilterTabOption<T extends string> = {
    value: T;
    label: string;
    count?: number;
};

type Props<T extends string> = {
    label: string;
    options: FilterTabOption<T>[];
    value: T;
    onChange: (value: T) => void;
};

const FilterTabsBase = <T extends string>({ label, options, value, onChange }: Props<T>): JSX.Element => (
    <div className={styles.filterTabs} role="group" aria-label={label}>
        {options.map((option) => {
            const isActive = option.value === value;
            return (
                <button
                    key={option.value}
                    type="button"
                    className={cn(styles.filterTabs__tab, isActive && styles.filterTabs__tabActive)}
                    aria-pressed={isActive}
                    onClick={() => onChange(option.value)}
                >
                    {option.label}
                    {option.count !== undefined && (
                        <span className={styles.filterTabs__count}>{option.count}</span>
                    )}
                </button>
            );
        })}
    </div>
);

const FilterTabs = memo(FilterTabsBase) as typeof FilterTabsBase & { displayName?: string };
FilterTabs.displayName = "FilterTabs";

export { FilterTabs };
