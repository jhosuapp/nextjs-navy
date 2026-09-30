import { memo, useMemo, type JSX } from "react";
import { EditIcon, EyeOffIcon, RestoreIcon } from "@/config/assets/icon/admin/AdminIcons";
import {
    DataTable,
    IconButton,
    PlayerAvatar,
    StatusBadge,
    type DataTableColumn,
} from "@/features/admin-core/components";
import { RoleChip } from "@/features/admin-staff/components";
import { ITranslations } from "@/shared/interfaces/globals";
import { AdminTester } from "../../interfaces";
import styles from "./testersTable.module.css";

type Props = {
    t: ITranslations;
    testers: AdminTester[];
    locale?: string;
    isLoading: boolean;
    isFetching: boolean;
    emptyText: string;
    pendingId?: string;
    onEdit: (tester: AdminTester) => void;
    onHide: (tester: AdminTester) => void;
    onRestore: (tester: AdminTester) => void;
};

const TestersTable = memo(
    ({ t, testers, locale, isLoading, isFetching, emptyText, pendingId, onEdit, onHide, onRestore }: Props): JSX.Element => {
        const columns = useMemo<DataTableColumn<AdminTester>[]>(() => {
            const format = new Intl.NumberFormat(locale);
            return [
                {
                    key: "tester",
                    header: t("testers.columns.tester"),
                    render: (tester) => (
                        <PlayerAvatar
                            id={tester.uuid ?? tester.nick ?? "steve"}
                            nick={tester.nick ?? t("testers.retired")}
                            subtitle={tester.discord_id}
                        />
                    ),
                },
                {
                    key: "role",
                    header: t("testers.columns.role"),
                    hideOnMobile: true,
                    render: (tester) =>
                        tester.role_name && tester.role_colour ? (
                            <RoleChip name={tester.role_name} colour={tester.role_colour} />
                        ) : (
                            <span className={styles.testersTable__muted}>—</span>
                        ),
                },
                {
                    key: "month",
                    header: t("testers.columns.month"),
                    hideOnMobile: true,
                    className: "tabular-nums",
                    render: (tester) => format.format(tester.month_tests),
                },
                {
                    key: "total",
                    header: t("testers.columns.total"),
                    className: "tabular-nums",
                    render: (tester) => format.format(tester.total_tests),
                },
                {
                    key: "status",
                    header: t("testers.columns.status"),
                    hideOnMobile: true,
                    render: (tester) => (
                        <div className={styles.testersTable__badges}>
                            {tester.hidden ? (
                                <StatusBadge tone="danger" title={tester.hidden_reason ?? undefined}>
                                    {t("common.hidden")}
                                </StatusBadge>
                            ) : (
                                <StatusBadge tone={tester.recent_tests > 0 ? "success" : "neutral"}>
                                    {tester.recent_tests > 0 ? t("testers.active") : t("testers.inactive")}
                                </StatusBadge>
                            )}
                            {tester.nick_override && <StatusBadge tone="info">{t("common.overridden")}</StatusBadge>}
                        </div>
                    ),
                },
                {
                    key: "actions",
                    header: t("common.actions"),
                    className: "text-right w-px",
                    render: (tester) => {
                        const isPending = pendingId === tester.discord_id;
                        return (
                            <div className={styles.testersTable__actions}>
                                <IconButton label={t("common.edit")} icon={<EditIcon size={18} />} onClick={() => onEdit(tester)} />
                                {tester.hidden ? (
                                    <IconButton
                                        label={t("common.restore")}
                                        icon={<RestoreIcon size={18} />}
                                        tone="success"
                                        disabled={isPending}
                                        onClick={() => onRestore(tester)}
                                    />
                                ) : (
                                    <IconButton
                                        label={t("common.hide")}
                                        icon={<EyeOffIcon size={18} />}
                                        tone="danger"
                                        disabled={isPending}
                                        onClick={() => onHide(tester)}
                                    />
                                )}
                            </div>
                        );
                    },
                },
            ];
        }, [t, locale, pendingId, onEdit, onHide, onRestore]);

        return (
            <DataTable
                caption={t("testers.title")}
                columns={columns}
                rows={testers}
                getRowKey={(tester) => tester.discord_id}
                isLoading={isLoading}
                isFetching={isFetching}
                emptyText={emptyText}
            />
        );
    }
);

TestersTable.displayName = "TestersTable";

export { TestersTable };
