import { memo, useMemo, type JSX } from "react";
import { EditIcon, EyeOffIcon, RestoreIcon } from "@/config/assets/icon/admin/AdminIcons";
import {
    DataTable,
    IconButton,
    PlayerAvatar,
    StatusBadge,
    type DataTableColumn,
} from "@/features/admin-core/components";
import { formatDateTime } from "@/features/admin-core/helpers";
import { ITranslations } from "@/shared/interfaces/globals";
import { AdminBan } from "../../interfaces";
import styles from "./bansTable.module.css";

type Props = {
    t: ITranslations;
    locale?: string;
    bans: AdminBan[];
    isLoading: boolean;
    isFetching: boolean;
    emptyText: string;
    pendingId?: number;
    onEdit: (ban: AdminBan) => void;
    onHide: (ban: AdminBan) => void;
    onRestore: (ban: AdminBan) => void;
};

const BansTable = memo(
    ({ t, locale, bans, isLoading, isFetching, emptyText, pendingId, onEdit, onHide, onRestore }: Props): JSX.Element => {
        const columns = useMemo<DataTableColumn<AdminBan>[]>(
            () => [
                {
                    key: "player",
                    header: t("bans.columns.player"),
                    render: (ban) => (
                        <PlayerAvatar
                            id={ban.uuid ?? ban.current.nick ?? "steve"}
                            nick={ban.current.nick ?? t("common.noNick")}
                            subtitle={`#${ban.id}`}
                        />
                    ),
                },
                {
                    key: "reason",
                    header: t("bans.columns.reason"),
                    className: "max-w-xs",
                    render: (ban) => (
                        <span className={styles.bansTable__reason} title={ban.current.reason}>
                            {ban.current.reason}
                        </span>
                    ),
                },
                {
                    key: "dates",
                    header: t("bans.columns.expiration"),
                    hideOnMobile: true,
                    render: (ban) => (
                        <div className={styles.bansTable__dates}>
                            <span>
                                {ban.current.expiration === null
                                    ? t("bans.permanent")
                                    : formatDateTime(ban.current.expiration, locale)}
                            </span>
                            <small>{t("bans.appliedAt", { date: formatDateTime(ban.applied, locale) })}</small>
                        </div>
                    ),
                },
                {
                    key: "status",
                    header: t("bans.columns.status"),
                    hideOnMobile: true,
                    render: (ban) => (
                        <div className={styles.bansTable__badges}>
                            {ban.hidden ? (
                                <StatusBadge tone="danger" title={ban.hidden_reason ?? undefined}>
                                    {t("common.hidden")}
                                </StatusBadge>
                            ) : ban.active ? (
                                <StatusBadge tone="warning">{t("bans.active")}</StatusBadge>
                            ) : (
                                <StatusBadge tone="neutral">{t("bans.expired")}</StatusBadge>
                            )}
                            {ban.current.is_cheater && <StatusBadge tone="danger">{t("bans.cheater")}</StatusBadge>}
                            {Object.keys(ban.overrides).length > 0 && (
                                <StatusBadge tone="info">{t("common.overridden")}</StatusBadge>
                            )}
                        </div>
                    ),
                },
                {
                    key: "actions",
                    header: t("common.actions"),
                    className: "text-right w-px",
                    render: (ban) => {
                        const isPending = pendingId === ban.id;
                        return (
                            <div className={styles.bansTable__actions}>
                                <IconButton label={t("common.edit")} icon={<EditIcon size={18} />} onClick={() => onEdit(ban)} />
                                {ban.hidden ? (
                                    <IconButton
                                        label={t("common.restore")}
                                        icon={<RestoreIcon size={18} />}
                                        tone="success"
                                        disabled={isPending}
                                        onClick={() => onRestore(ban)}
                                    />
                                ) : (
                                    <IconButton
                                        label={t("common.hide")}
                                        icon={<EyeOffIcon size={18} />}
                                        tone="danger"
                                        disabled={isPending}
                                        onClick={() => onHide(ban)}
                                    />
                                )}
                            </div>
                        );
                    },
                },
            ],
            [t, locale, pendingId, onEdit, onHide, onRestore]
        );

        return (
            <DataTable
                caption={t("bans.title")}
                columns={columns}
                rows={bans}
                getRowKey={(ban) => ban.id}
                isLoading={isLoading}
                isFetching={isFetching}
                emptyText={emptyText}
            />
        );
    }
);

BansTable.displayName = "BansTable";

export { BansTable };
