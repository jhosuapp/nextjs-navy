import { useChatBotStore } from "../stores/chatBot.store";
import { useUserNameQuery } from "./useUserNameQuery"

const useUserNameController = () => {
    const messagesSaved = useChatBotStore( state => state.messagesSaved );
    const response = useUserNameQuery(messagesSaved.uuid);

    return {
        messagesSaved,
    }
}

export { useUserNameController }