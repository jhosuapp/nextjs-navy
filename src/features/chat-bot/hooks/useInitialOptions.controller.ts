import { ItemBotMessage } from "../interfaces/chatBot.interface";
import { useChatBotStore } from "../stores/chatBot.store";

type Props = {
    messages: ItemBotMessage[];
}

const useRadioStepController = ({ messages }:Props) => {
    const setMessage = useChatBotStore( state => state.setMessage );
    const currentStep = useChatBotStore( state => state.currentStep );
    const setCurrentStep = useChatBotStore( state => state.setCurrentStep );
    const setIsTyping = useChatBotStore( state => state.setIsTyping );

    const handleSetMessages = (options:ItemBotMessage[]) => {
        setIsTyping(true);
        options.map((item)=>{
            setMessage(item);
        });
    }

    const handleSetAnswer = (text:string, enableNextStep:number) => {
        setCurrentStep(enableNextStep);
        setMessage({
            text: text,
            userResponse: true,
            delayMessage: 0
        }); 

        handleSetMessages(messages);
    }

    return {
        handleSetAnswer,
        currentStep,
    }
}

export { useRadioStepController }