import { getPublicStaff } from "@/config/lib/adminOverrides";
import { prisma } from "@/config/lib/prisma";
import { getStaffProfilesMap, resolveStaffStatus } from "@/config/lib/staffProfiles";
import { daysAgo, getTesterCountsSince, monthStart } from "@/config/lib/testers";
import { STAFF_ACTIVE_WINDOW_DAYS } from "@/shared/constants/staffProfile";
import { GroupedStaffResponse, StaffMember } from "../interfaces";

export async function fetchStaffData(): Promise<{ data: GroupedStaffResponse; revalidate: number }> {
    try {
        // Con overrides del panel aplicados, sin ocultos y ordenado por peso.
        const members = await getPublicStaff();
        const ids = members.map((member) => member.discord_id);

        const [profiles, totals, recent, month] = await Promise.all([
            getStaffProfilesMap(ids),
            prisma.tier_testers.findMany({ where: { discord_id: { in: ids } } }),
            getTesterCountsSince(daysAgo(STAFF_ACTIVE_WINDOW_DAYS), ids),
            getTesterCountsSince(monthStart(new Date()), ids),
        ]);
        const totalById = new Map(totals.map((row) => [row.discord_id, row.count]));

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

            const profile = profiles.get(member.discord_id);
            const testsTotal = totalById.get(member.discord_id) ?? 0;
            const entry: StaffMember = {
                discord_id: member.discord_id,
                uuid: member.uuid,
                nick: member.nick,
                is_premium: member.is_premium,
                staff_role_id: member.staff_role_id,
                staff_role_name: member.staff_role_name,
                staff_role_colour: member.staff_role_colour,
                bio: profile?.bio ?? null,
                status: resolveStaffStatus(
                    profile?.status_mode ?? null,
                    recent.get(member.discord_id) ?? 0,
                    testsTotal > 0
                ),
                socials: {
                    instagram: profile?.instagram ?? null,
                    tiktok: profile?.tiktok ?? null,
                    youtube: profile?.youtube ?? null,
                    twitch: profile?.twitch ?? null,
                    x: profile?.x ?? null,
                    github: profile?.github ?? null,
                    linkedin: profile?.linkedin ?? null,
                    discord_username: profile?.discord_username ?? null,
                },
                show_namemc: profile?.show_namemc ?? true,
                tests_total: testsTotal,
                tests_month: month.get(member.discord_id) ?? 0,
            };

            acc[roleName].members.push(entry);
            acc[roleName].count = acc[roleName].members.length;
            return acc;
        }, {});

        return { data: Object.values(grouped), revalidate: 3600 };
    } catch (error) {
        console.error("[staff] fetch failed:", error);
        return { data: [], revalidate: 1 };
    }
}
