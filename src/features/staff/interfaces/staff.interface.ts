// types/staff.ts
export interface StaffMember {
  discord_id: string;
  uuid: string | null;
  nick: string | null;
  is_premium: boolean | null;
  staff_role_id: string;
  staff_role_name: string;
  staff_role_colour: string;
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