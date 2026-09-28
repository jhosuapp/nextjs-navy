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
import { AdminStaffMember } from "../../interfaces";
import { RoleChip } from "../role-chip/RoleChip";
import styles from "./staffTable.module.css";

type Props = {
    t: ITranslations;
    members: AdminStaffMember[];
    isLoading: boolean;
    isFetching: boolean;
    emptyText: string;
    pendingId?: string;
    onEdit: (member: AdminStaffMember) => void;
    onHide: (member: AdminStaffMember) => void;
    onRestore: (member: AdminStaffMember) => void;
};

const StaffTable = memo(
    ({ t, members, isLoading, isFetching, emptyText, pendingId, onEdit, onHide, onRestore }: Props): JSX.Element => {
        const columns = useMemo<DataTableColumn<AdminStaffMember>[]>(
            () => [
                {
                    key: "member",
                    header: t("staff.columns.member"),
                    render: (member) => (
                        <PlayerAvatar
                            id={member.uuid ?? member.current.nick ?? "steve"}
                            nick={member.current.nick ?? t("common.noNick")}
                            subtitle={member.discord_id}
                        />
                    ),
                },
                {
                    key: "role",
                    header: t("staff.columns.role"),
                    render: (member) => <RoleChip name={member.current.role_name} colour={member.current.role_colour} />,
                },
                {
                    key: "weight",
                    header: t("staff.columns.weight"),
                    hideOnMobile: true,
                    className: "tabular-nums",
                    render: (member) => member.current.role_weight,
                },
                {
                    key: "status",
                    header: t("staff.columns.status"),
                    hideOnMobile: true,
                    render: (member) => (
                        <div className={styles.staffTable__badges}>
                            {member.hidden ? (
                                <StatusBadge tone="danger" title={member.hidden_reason ?? undefined}>
                                    {t("common.hidden")}
                                </StatusBadge>
                            ) : (
                                <StatusBadge tone="success">{t("common.visible")}</StatusBadge>
                            )}
                            {Object.keys(member.overrides).length > 0 && (
                                <StatusBadge tone="info">{t("common.overridden")}</StatusBadge>
                            )}
                        </div>
                    ),
                },
                {
                    key: "actions",
                    header: t("common.actions"),
                    className: "text-right w-px",
                    render: (member) => {
                        const isPending = pendingId === member.discord_id;
                        return (
                            <div className={styles.staffTable__actions}>
                                <IconButton label={t("common.edit")} icon={<EditIcon size={18} />} onClick={() => onEdit(member)} />
                                {member.hidden ? (
                                    <IconButton
                                        label={t("common.restore")}
                                        icon={<RestoreIcon size={18} />}
                                        tone="success"
                                        disabled={isPending}
                                        onClick={() => onRestore(member)}
                                    />
                                ) : (
                                    <IconButton
                                        label={t("common.hide")}
                                        icon={<EyeOffIcon size={18} />}
                                        tone="danger"
                                        disabled={isPending}
                                        onClick={() => onHide(member)}
                                    />
                                )}
                            </div>
                        );
                    },
                },
            ],
            [t, pendingId, onEdit, onHide, onRestore]
        );

        return (
            <DataTable
                caption={t("staff.title")}
                columns={columns}
                rows={members}
                getRowKey={(member) => member.discord_id}
                isLoading={isLoading}
                isFetching={isFetching}
                emptyText={emptyText}
            />
        );
    }
);

StaffTable.displayName = "StaffTable";

export { StaffTable };
