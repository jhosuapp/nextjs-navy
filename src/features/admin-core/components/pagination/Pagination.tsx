import { memo, type JSX } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/config/assets/icon/admin/AdminIcons";
import { ITranslations } from "@/shared/interfaces/globals";
import { IconButton } from "../icon-button/IconButton";
import styles from "./pagination.module.css";

type Props = {
    t: ITranslations;
    page: number;
    totalPages: number;
    isFetching: boolean;
    onPrev: () => void;
    onNext: () => void;
};

const Pagination = memo(
    ({ t, page, totalPages, isFetching, onPrev, onNext }: Props): JSX.Element | null => {
        if (totalPages <= 1) return null;

        return (
            <nav className={styles.pagination} aria-label={t("pagination.label")}>
                <IconButton
                    label={t("pagination.prev")}
                    icon={<ChevronLeftIcon />}
                    onClick={onPrev}
                    disabled={page <= 1 || isFetching}
                />
                <span className={styles.pagination__info} aria-live="polite">
                    {t("pagination.status", { page, totalPages })}
                </span>
                <IconButton
                    label={t("pagination.next")}
                    icon={<ChevronRightIcon />}
                    onClick={onNext}
                    disabled={page >= totalPages || isFetching}
                />
            </nav>
        );
    }
);

Pagination.displayName = "Pagination";

export { Pagination };
