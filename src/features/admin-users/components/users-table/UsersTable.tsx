import { memo, useMemo, type JSX } from "react";
import { EditIcon, EyeOffIcon, RestoreIcon } from "@/config/assets/icon/admin/AdminIcons";
import {
    DataTable,
    IconButton,
    PlayerAvatar,
    StatusBadge,
    type DataTableColumn,
} from "@/features/admin-core/components";
import { ITranslations } from "@/shared/interfaces/globals";
import { AdminUser } from "../../interfaces";
import styles from "./usersTable.module.css";

type Props = {
    t: ITranslations;
    users: AdminUser[];
    isLoading: boolean;
    isFetching: boolean;
    emptyText: string;
    pendingKey?: string;
    onEdit: (user: AdminUser) => void;
    onHide: (user: AdminUser) => void;
    onRestore: (user: AdminUser) => void;
};

const MAX_GAMES = 4;

const UsersTable = memo(
    ({ t, users, isLoading, isFetching, emptyText, pendingKey, onEdit, onHide, onRestore }: Props): JSX.Element => {
        const columns = useMemo<DataTableColumn<AdminUser>[]>(
            () => [
                {
                    key: "player",
                    header: t("users.columns.player"),
                    render: (user) => (
                        <PlayerAvatar
                            id={user.uuid ?? user.nick}
                            nick={user.nick}
                            subtitle={user.nick_override ? t("users.originalNick", { nick: user.original_nick }) : user.region}
                        />
                    ),
                },
                {
                    key: "points",
                    header: t("users.columns.points"),
                    className: "tabular-nums font-semibold",
                    render: (user) => user.points,
                },
                {
                    key: "games",
                    header: t("users.columns.games"),
                    hideOnMobile: true,
                    render: (user) => (
                        <div className={styles.usersTable__games}>
                            {user.games.slice(0, MAX_GAMES).map((game) => (
                                <span key={game.game} className={styles.usersTable__game} title={game.game}>
                                    {game.game} <b>{game.tier}</b>
                                </span>
                            ))}
                            {user.games.length > MAX_GAMES && (
                                <span className={styles.usersTable__more}>+{user.games.length - MAX_GAMES}</span>
                            )}
                        </div>
                    ),
                },
                {
                    key: "status",
                    header: t("users.columns.status"),
                    hideOnMobile: true,
                    render: (user) => (
                        <div className={styles.usersTable__badges}>
                            {user.hidden ? (
                                <StatusBadge tone="danger" title={user.hidden_reason ?? undefined}>
                                    {t("common.hidden")}
                                </StatusBadge>
                            ) : (
                                <StatusBadge tone="success">{t("users.inRanking")}</StatusBadge>
                            )}
                            {user.nick_override && <StatusBadge tone="info">{t("common.overridden")}</StatusBadge>}
                            {!user.uuid && <StatusBadge tone="neutral">{t("users.noPremium")}</StatusBadge>}
                        </div>
                    ),
                },
                {
                    key: "actions",
                    header: t("common.actions"),
                    className: "text-right w-px",
                    render: (user) => {
                        const isPending = pendingKey === user.key;
                        return (
                            <div className={styles.usersTable__actions}>
                                <IconButton label={t("common.edit")} icon={<EditIcon size={18} />} onClick={() => onEdit(user)} />
                                {user.hidden ? (
                                    <IconButton
                                        label={t("common.restore")}
                                        icon={<RestoreIcon size={18} />}
                                        tone="success"
                                        disabled={isPending}
                                        onClick={() => onRestore(user)}
                                    />
                                ) : (
                                    <IconButton
                                        label={t("users.hideAction")}
                                        icon={<EyeOffIcon size={18} />}
                                        tone="danger"
                                        disabled={isPending}
                                        onClick={() => onHide(user)}
                                    />
                                )}
                            </div>
                        );
                    },
                },
            ],
            [t, pendingKey, onEdit, onHide, onRestore]
        );

        return (
            <DataTable
                caption={t("users.title")}
                columns={columns}
                rows={users}
                getRowKey={(user) => user.key}
                isLoading={isLoading}
                isFetching={isFetching}
                emptyText={emptyText}
            />
        );
    }
);

UsersTable.displayName = "UsersTable";

export { UsersTable };
