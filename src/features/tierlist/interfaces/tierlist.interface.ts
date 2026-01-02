import { Continents, Tiers } from "@/shared/interfaces"

type GameTier = {
    name: string
    tier: Tiers
  }
  
type GamesMap = Record<string, GameTier>
  
export type TierlistUser = {
    nick: string
    region: Continents
    points: number
    games: GamesMap
}
  
export type TierlistOverallResponse = {
    page: number
    limit: number
    total: number
    totalPages: number
    data: TierlistUser[]
}