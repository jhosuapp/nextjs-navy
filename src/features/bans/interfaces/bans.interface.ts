export type Punishment = {
    id: number;
    discord_id: string;
    uuid: string | null;
    nick: string | null;
    is_premium: boolean;
    punisher_id: string;
    applied: Date;
    expiration: Date | null;
    permanent: boolean;
    active: boolean;
    reason: string;
    is_cheater: boolean;
};
  
export type BansResponse = {
    active: Punishment[];
    inactive: Punishment[];
};