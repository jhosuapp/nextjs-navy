import { memo, type JSX } from "react";
import { InboxIcon } from "@/config/assets/icon/admin/AdminIcons";
import styles from "./emptyState.module.css";

type Props = {
    text: string;
};

const EmptyState = memo(
    ({ text }: Props): JSX.Element => (
        <div className={styles.emptyState} role="status">
            <span className={styles.emptyState__icon}>
                <InboxIcon size={24} />
            </span>
            <p className={styles.emptyState__text}>{text}</p>
        </div>
    )
);

EmptyState.displayName = "EmptyState";

export { EmptyState };
