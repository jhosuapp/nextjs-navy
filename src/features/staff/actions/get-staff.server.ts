import { prisma } from "@/config/lib/prisma";
import { GroupedStaffResponse } from "../interfaces";

export async function fetchStaffData(): Promise<GroupedStaffResponse> {
    const members = await prisma.staff.findMany({
        orderBy: { staff_role_weight: 'desc' },
    });

    const grouped = members.reduce<Record<string, GroupedStaffResponse[number]>>((acc, member) => {
        const roleName = member.staff_role_name;
        if (!acc[roleName]) {
            acc[roleName] = {
                role_name: roleName,
                role_colour: member.staff_role_colour,
                role_id: member.staff_role_id,
                count: 0,
                members: [],
            };
        }
        acc[roleName].members.push({
            discord_id: member.discord_id,
            uuid: member.uuid,
            nick: member.nick,
            is_premium: member.is_premium,
            staff_role_id: member.staff_role_id,
            staff_role_name: member.staff_role_name,
            staff_role_colour: member.staff_role_colour,
        });
        acc[roleName].count = acc[roleName].members.length;
        return acc;
    }, {});

    return Object.values(grouped);
}
