import type { JSX } from "react";
import { Spinner } from "@/shared/components";
import { BotMessageWrapper } from "./BotMessageWrapper";

import styles from './botMessage.module.css';

const BotMessageLoad = ():JSX.Element => {
    return (
        <BotMessageWrapper isPurple>
            <div className={ styles.botMessageLoad }>
                <Spinner />
                <p>Please wait a moment</p>
            </div>
        </BotMessageWrapper>
    )
}

export { BotMessageLoad }