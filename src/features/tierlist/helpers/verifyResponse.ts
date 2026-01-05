import { TierlistByGameSummaryResponse, TierlistByModalitieResponse } from "../interfaces"

const isSummaryResponse = (
    res: TierlistByModalitieResponse
  ): res is TierlistByGameSummaryResponse => {
    return "data" in res && Array.isArray(res.data)
}

export { isSummaryResponse }