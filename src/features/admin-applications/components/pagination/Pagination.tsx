import { memo, type JSX } from "react";
import { Button } from "@/shared/components/button/Button";
import { ITranslations } from "@/shared/interfaces/globals";
import iconRight from '@/config/assets/svg/icon-arrow-right.svg';
import iconLeft from '@/config/assets/svg/icon-arrow-left.svg';

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
    ({ t, page, totalPages, isFetching, onPrev, onNext }: Props): JSX.Element => (
        <div className={styles.pagination}>
            <Button
                type="button"
                style="fit"
                onClick={onPrev}
                disabled={page <= 1 || isFetching}
                iconRight={iconLeft}
                isSmall
            />
            <span className={styles.pagination__info}>
                {t("pagination.status", { page, totalPages })}
            </span>
            <Button
                type="button"
                style="fit"
                onClick={onNext}
                disabled={page >= totalPages || isFetching}
                iconRight={iconRight}
                isSmall
            />
        </div>
    )
);

Pagination.displayName = "Pagination";

export { Pagination };
