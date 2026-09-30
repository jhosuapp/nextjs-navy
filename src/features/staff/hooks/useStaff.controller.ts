import { useMemo } from "react";
import { useTranslation } from "next-i18next";
import { GroupedStaffResponse } from "../interfaces";
import { useOnlineStaffQuery } from "./useOnlineStaffQuery";

const useStaffController = (staff: GroupedStaffResponse) => {
    const { t, i18n } = useTranslation("staff");
    const onlineQuery = useOnlineStaffQuery();

    const onlineIds = useMemo(() => new Set(onlineQuery.data?.ids ?? []), [onlineQuery.data]);

    // Dentro de cada rol, primero quien está conectado (el orden por peso se mantiene).
    const groups = useMemo(
        () =>
            staff.map((group) => ({
                ...group,
                members: [...group.members].sort(
                    (a, b) => Number(onlineIds.has(b.discord_id)) - Number(onlineIds.has(a.discord_id))
                ),
            })),
        [staff, onlineIds]
    );

    const onlineCount = useMemo(
        () => staff.reduce((sum, group) => sum + group.members.filter((m) => onlineIds.has(m.discord_id)).length, 0),
        [staff, onlineIds]
    );

    return {
        t,
        locale: i18n.language,
        groups,
        onlineIds,
        onlineCount,
        hasOnlineData: onlineQuery.isSuccess,
    };
};

export { useStaffController };
