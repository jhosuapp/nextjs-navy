import { memo, type JSX } from "react";
import { ITranslations } from "@/shared/interfaces/globals";
import { RankedTester } from "../../interfaces";
import { PodiumCard, PodiumPlace } from "./PodiumCard";

import styles from './podium.module.css';

type Props = {
    testers: RankedTester[];
    locale: string;
    t: ITranslations;
    onOpen: (nick: string | null) => void;
}

const Podium = memo(({ testers, locale, t, onOpen }: Props): JSX.Element => (
    <section className={ styles.podium } aria-label={ t('podium.title') }>
        {/* Orden del DOM 1-2-3 (lectores de pantalla y móvil); en desktop el CSS lo coloca 2-1-3. */}
        <ol className={ styles.podium__list }>
            {testers.map((tester, index) => (
                <PodiumCard
                    key={ tester.discord_id }
                    tester={ tester }
                    place={ (index + 1) as PodiumPlace }
                    locale={ locale }
                    t={ t }
                    onOpen={ onOpen }
                />
            ))}
        </ol>
    </section>
));

Podium.displayName = 'Podium';

export { Podium }
