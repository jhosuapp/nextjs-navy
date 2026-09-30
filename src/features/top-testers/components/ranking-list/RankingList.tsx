import { memo, type JSX } from "react";
import { Button } from "@/shared/components/button/Button";
import { ITranslations } from "@/shared/interfaces/globals";
import { RankedTester } from "../../interfaces";
import { RankingRow } from "./RankingRow";

import styles from './rankingList.module.css';

type Props = {
    testers: RankedTester[];
    hasMore: boolean;
    locale: string;
    t: ITranslations;
    onOpen: (nick: string | null) => void;
    onShowMore: () => void;
}

const RankingList = memo(({ testers, hasMore, locale, t, onOpen, onShowMore }: Props): JSX.Element => (
    <div className={ styles.rankingList }>
        <ol className={ styles.rankingList__items }>
            {testers.map((tester, index) => (
                <RankingRow
                    key={ tester.discord_id }
                    tester={ tester }
                    index={ index }
                    locale={ locale }
                    t={ t }
                    onOpen={ onOpen }
                />
            ))}
        </ol>
        {hasMore && (
            <div className={ styles.rankingList__more }>
                <Button type="button" style="secondary" text={ t('list.more') } onClick={ onShowMore } />
            </div>
        )}
    </div>
));

RankingList.displayName = 'RankingList';

export { RankingList }
