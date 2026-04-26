import { ItemBotMessage } from "../interfaces/chatBot.interface";
import { useChatBotStore } from "../stores/chatBot.store";

type Props = {
    messages?: ItemBotMessage[] | null;
    enableNextStep: number;
    resetFlux?: boolean;
    enableInAnyStep?: boolean;
    callBackHandleClick?: (value:string)=> ItemBotMessage[];
}

const useRadioStepController = ({ enableNextStep, messages, callBackHandleClick, resetFlux, enableInAnyStep }:Props) => {
    const setMessage = useChatBotStore( state => state.setMessage );
    const currentStep = useChatBotStore( state => state.currentStep );
    const setCurrentStep = useChatBotStore( state => state.setCurrentStep );
    const setIsTyping = useChatBotStore( state => state.setIsTyping );
    const setReloadInitialOptions = useChatBotStore( state => state.setReloadInitialOptions );

    const handleSetMessages = (options:ItemBotMessage[]) => {
        setIsTyping(true);
        options.map((item)=>{
            setMessage(item);
        });
    }

    const handleSetAnswer = (text:string, enableNextStep:number, messages:ItemBotMessage[]) => {
        setCurrentStep(enableNextStep);
        setMessage({
            text: text,
            userResponse: true,
            delayMessage: 0
        }); 

        handleSetMessages(messages);
    }

    const handleClick = (value:string)=> {
        // Validate if this step is enabled in any step, if not, validate if the current step is the one that should be enabled
        if(enableInAnyStep){
            if(callBackHandleClick){
                const messagesCallback = callBackHandleClick(value);
                setMessage({
                    text: value,
                    userResponse: true,
                    delayMessage: 0
                })
                return handleSetMessages(messagesCallback);
            }
            return handleSetAnswer(value, enableNextStep, messages ?? []);
        }

        // Validate if there is a callback function to handle the click, if there is, execute it and get the messages to set
        if(callBackHandleClick){
            const messagesCallback = callBackHandleClick(value);
            return handleSetAnswer(value, enableNextStep, messagesCallback);
        }


        if(resetFlux && messages?.length){
            const lastDelayMessage = messages[messages.length - 1].delayMessage ?? 0;
            setReloadInitialOptions({ delay: (lastDelayMessage + 2), enabled: true, reload: false });
            return handleSetAnswer(value, enableNextStep, messages);
        }
        
        handleSetAnswer(value, enableNextStep, messages ?? []);
    }

    return {
        handleSetAnswer,
        currentStep,
        setReloadInitialOptions,
        handleClick
    }
}

export { useRadioStepController }