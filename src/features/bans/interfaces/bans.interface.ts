export type Punishment = {
    id: number;
    uuid: string | null;
    nick: string | null;
    is_premium: boolean;
    applied: string;
    expiration: string | null;
    permanent: boolean;
    active: boolean;
    reason: string;
    is_cheater: boolean;
};
  
export type BansResponse = {
    active: Punishment[];
    inactive: Punishment[];
};