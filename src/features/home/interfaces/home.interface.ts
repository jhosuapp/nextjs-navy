import { Continents } from "@/shared/interfaces/regions.interface"
import { Tiers } from "@/shared/interfaces/tiers.interface"
import { Modalitie } from "@/shared/interfaces/modalities.interface"

export type TestEntry = {
    id: number
    nick: string
    region: Continents
    tier: Tiers
    game: Modalitie
    date: string
}
  
export type TierlistResumeResponse = {
    latest_h_tests: TestEntry[]
    latest_l_tests: TestEntry[]
    total_tests: Record<string, number>
}