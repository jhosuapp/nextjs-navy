import { Tiers } from "@/shared/interfaces/tiers.interface"
import { Continents } from "@/shared/interfaces/regions.interface"
import { Modalitie } from "@/shared/interfaces/modalities.interface"

type GameTier = {
    name: string
    tier: Tiers
  }
  
type GamesMap = Record<Modalitie, GameTier>
  
export type TierlistUser = {
    nick: string
    region: Continents
    points: number
    position: number
    games: GamesMap
}
  
export type TierlistOverallResponse = {
    page: number
    limit: number
    total: number
    totalPages: number
    data: TierlistUser[]
}

// Filter by modalitie

export type TierItem = {
    nick: string
    region: Continents
    is_h: boolean
}
  
export type TierKey = "t1" | "t2" | "t3" | "t4" | "t5"

export type TierlistByModalitieArgs = {
    game?: Modalitie | null;
    tier?: TierKey | null;
    page?: number | null;
}

export type TierlistByGamePaginatedResponse = {
    game: string
    tier: TierKey
    page: number
    limit: number
    total: number
    totalPages: number
    data: TierItem[]
}

export type TierlistByGameSummary = {
    game: Modalitie
    total_users: number
    tiers: Record<TierKey, TierItem[]>
}
  
export type TierlistByGameSummaryResponse = {
    data: TierlistByGameSummary[]
}