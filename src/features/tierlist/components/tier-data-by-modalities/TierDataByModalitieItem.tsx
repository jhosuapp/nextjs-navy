import { SwiperSlide } from "swiper/react"
import { TierWrapper } from "../tier-wrapper/TierWrapper"
import { Button, CardSkin } from "@/shared/components"
import { useTierlistByModalitieAndTier } from "../../hooks/useTierlistByModalitieQuery";
import { Modalitie } from "@/shared/interfaces";
import { TierKey, TierlistByGameSummary } from "../../interfaces";
import { useState } from "react";

type Props = {
    currentModalitie: Modalitie;
    data: TierlistByGameSummary;
    tier: TierKey;
    tierNumber: 1 | 2 | 3 | 4 | 5;
    delay: { enter: number, exit: number };
    variants: 'primary' | 'secondary' | 'tertiary' | 'fourth' | 'fifth';
}

const TierDataByModalitieItem = ({ currentModalitie, data, tier, tierNumber, delay, variants }:Props):JSX.Element => {
    const [enabled, setEnabled] = useState<boolean>(false);
    const tierRequest = useTierlistByModalitieAndTier({
        game: currentModalitie,
        tier: tier,
        enabled
    });

    const initialPlayers = data?.tiers?.[tier] ?? [];
    const paginatedPlayers = tierRequest.data?.pages.flatMap(page => page.data) ?? [];
    const players = paginatedPlayers.length > 0
        ? [...initialPlayers, ...paginatedPlayers]
        : initialPlayers;
    const hasInitialMore = (data?.tiers?.[tier]?.length ?? 0) >= 8;
    const hasPaginatedData = tierRequest.data?.pages?.length > 0;
    const shouldShowLoadMore =
        (!hasPaginatedData && hasInitialMore) ||
        (hasPaginatedData && tierRequest.hasNextPage);

    return (
        <TierWrapper
            count={players?.length ?? 0}
            tier={tierNumber}
            variants={ variants }
            delay={{ enter: delay.enter, exit: delay.exit }}
            key={`${currentModalitie}-tier-wrapper`}
        >

            {players.map((item, index) => (
                <CardSkin
                    key={`${item.nick}-${index}`}
                    className="!justify-between w-full !px-4 !py-3"
                    username={item.nick}
                    width={50}
                    height={150}
                    continent={item.region}
                    direction="row"
                    showRegions
                    showUsername
                    showModalities={false}
                />
            ))}
            {!players.length && (
                <div className="px-5 py-10">
                    <p className="text-base text-white text-center">There are no players at this level yet.</p>
                </div>
            )}
            {shouldShowLoadMore && (
                <div className="flex justify-center px-5 py-4 sticky bottom-0">
                    <Button
                        onClick={ ()=> tierRequest.fetchNextPage() }
                        disabled={ tierRequest.isFetchingNextPage }
                        text={ tierRequest.isFetchingNextPage ? 'Loading...' : 'Load more players'} style={'secondary' } 
                    />
                </div>
            )}
        </TierWrapper>
    )
}

export { TierDataByModalitieItem }