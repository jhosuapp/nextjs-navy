import { useState, type JSX } from "react";
import { TierWrapper } from "../tier-wrapper/TierWrapper"
import { Button, CardSkin } from "@/shared/components"
import { useTierlistByModalitieAndTier } from "../../hooks/useTierlistByModalitieQuery";
import { ITranslations, Modalitie } from "@/shared/interfaces";
import { TierKey, TierlistByGameSummary } from "../../interfaces";

type Props = {
    currentModalitie: Modalitie;
    data: TierlistByGameSummary;
    tier: TierKey;
    tierNumber: 1 | 2 | 3 | 4 | 5;
    delay: { enter: number, exit: number };
    variants: 'primary' | 'secondary' | 'tertiary' | 'fourth' | 'fifth';
    t: ITranslations;
}

const TierDataByModalitieItem = ({ currentModalitie, data, tier, tierNumber, delay, variants, t }:Props):JSX.Element => {
    const [enabled, setEnabled] = useState<boolean>(false);
    const tierRequest = useTierlistByModalitieAndTier({
        game: currentModalitie,
        tier: tier,
        enabled
    });

    const initialPlayers = data?.tiers?.[tier] ?? [];
    const highPlayers = initialPlayers.filter(player => player.is_h);
    const filteredInitialPlayers = highPlayers.length > 8 
        ? highPlayers.slice(0, 8)  
        : initialPlayers.slice(0, 8);  
    const paginatedPlayers = tierRequest.data?.pages.flatMap(page => page.data) ?? [];
    const players = paginatedPlayers.length > 0 ? [...filteredInitialPlayers, ...paginatedPlayers] : filteredInitialPlayers;
    const hasInitialMore = (data?.tiers?.[tier]?.length ?? 0) >= 8;
    const hasPaginatedData = (tierRequest.data?.pages?.length ?? 0) > 0;
    const shouldShowLoadMore = (!hasPaginatedData && hasInitialMore) || (hasPaginatedData && tierRequest.hasNextPage);
    const uniquePlayers = Array.from(new Map(players.map(player => [player.nick, player])).values());

    return (
        <TierWrapper
            count={players?.length ?? 0}
            tier={tierNumber}
            variants={ variants }
            delay={{ enter: delay.enter, exit: delay.exit }}
            key={`${currentModalitie}-tier-wrapper`}
        >

            {uniquePlayers.map((item, index) => (
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
                    hasTierIndicator
                    showModalities={false}
                    isHight={ item.is_h }
                />
            ))}
            {!players.length && (
                <div className="px-5 py-10">
                    <p className="text-base text-white text-center">{ t('feedback.notFoundPlayersByModalitie') }</p>
                </div>
            )}
            {shouldShowLoadMore && (
                <div className="flex justify-center px-5 py-4 sticky bottom-0 bg-tertiary bg-opacity-80 backdrop-blur-sm border-t-2 border-black">
                    <Button
                        onClick={ ()=> tierRequest.fetchNextPage() }
                        disabled={ tierRequest.isFetchingNextPage }
                        text={ tierRequest.isFetchingNextPage ? t('feedback.ctaLoader') : t('cta')} style={'secondary' } 
                    />
                </div>
            )}
        </TierWrapper>
    )
}

export { TierDataByModalitieItem }