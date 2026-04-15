import type { JSX } from "react";
import { AnimatePresence } from "framer-motion";
import { BotSticky } from "../components/bot-sticky/BotSticky";
import { BotWrapper } from "../components/bot-wrapper/BotWrapper";
import { useChatBotStore } from "../stores/chatBot.store";

const ChatBotView = ():JSX.Element => {
    const enableBot = useChatBotStore( state => state.enableBot );

    return (
        <>
            <AnimatePresence mode="wait">
                {enableBot && <BotWrapper key={`bot-wrapper`} />}            
            </AnimatePresence>
            <BotSticky />
        </>
    )
}

export { ChatBotView }