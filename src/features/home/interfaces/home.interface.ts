import { Continents, Modalitie, Tiers } from "@/shared/interfaces"

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
    total_tests: Record<Modalitie, number>
}