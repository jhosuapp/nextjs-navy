import type { JSX } from "react";
import { useTranslation } from "next-i18next";
import { Spinner } from "@/shared/components/spinner/Spinner";
import { BotMessageWrapper } from "./BotMessageWrapper";

import styles from './botMessage.module.css';

const BotMessageLoad = ():JSX.Element => {
    const { t } = useTranslation("common");

    return (
        <BotMessageWrapper isPurple>
            <div className={ styles.botMessageLoad }>
                <Spinner />
                <p>{ t('chatBot.loading') }</p>
            </div>
        </BotMessageWrapper>
    )
}

export { BotMessageLoad }
