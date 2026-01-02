import { Continents, Tiers } from "@/shared/interfaces"

type GameTier = {
    name: string
    tier: Tiers
  }
  
type GamesMap = Record<'sword'|'netherite'|'crystal', GameTier>
  
export type TierlistUser = {
    nick: string
    region: Continents
    points: number
    position?: number
    games: GamesMap
}
  
export type TierlistOverallResponse = {
    page: number
    limit: number
    total: number
    totalPages: number
    data: TierlistUser[]
}