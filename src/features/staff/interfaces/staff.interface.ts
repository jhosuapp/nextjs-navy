import { StaffStatus } from "@/shared/constants/staffProfile";

export type StaffSocials = {
  instagram: string | null;
  tiktok: string | null;
  youtube: string | null;
  twitch: string | null;
  x: string | null;
  github: string | null;
  linkedin: string | null;
  discord_username: string | null;
};

export interface StaffMember {
  discord_id: string;
  uuid: string | null;
  nick: string | null;
  is_premium: boolean | null;
  staff_role_id: string;
  staff_role_name: string;
  staff_role_colour: string;
  bio: string | null;
  /** `null` = no se muestra badge (no es tester y no hay estado manual). */
  status: StaffStatus | null;
  socials: StaffSocials;
  show_namemc: boolean;
  /** Tests como tester: histórico y mes en curso. */
  tests_total: number;
  tests_month: number;
}

export interface GroupedStaffMember {
  discord_id: string;
  uuid: string | null;
  nick: string | null;
  is_premium: boolean | null;
}

export interface GroupedStaff {
  role_name: string;
  role_colour: string;
  role_id: string;
  count: number;
  members: StaffMember[];
}

export type GroupedStaffResponse = GroupedStaff[];
export type OnlineStaffResponse = {
  ids: string[];
};
