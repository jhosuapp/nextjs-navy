import type { JSX } from "react";
import { RadioField } from "@/shared/components/radio-field/RadioField"
import { BotMessageWrapper } from "../../bot-message/BotMessageWrapper"
import { useRadioStepController } from "@/features/chat-bot/hooks/useRadioStep.controller";
import { ItemBotMessage } from "@/features/chat-bot/interfaces/chatBot.interface";

type Props = {
    options: {
        name: string;
        value: string;
    }[];
    messages?: ItemBotMessage[] | null;
    enableAtStep: number;
    enableNextStep: number;
    resetFlux?: boolean;
    callBackHandleClick?: (value:string)=> ItemBotMessage[];
}

const RadioStep = ({ options, enableAtStep, enableNextStep, messages, callBackHandleClick, resetFlux = false }:Props):JSX.Element => {
    const { handleSetAnswer, currentStep } = useRadioStepController();

    if(currentStep !== enableAtStep){
        return <></>
    }

    const handleClick = (value:string)=> {
        if(callBackHandleClick){
            const messagesCallback = callBackHandleClick(value);
            handleSetAnswer(value, enableNextStep, messagesCallback);
        }else{
            if(resetFlux && messages?.length){
                const lastDelayMessage = messages[messages.length - 1].delayMessage;
                const newMessage = { text: 'Do you need anything else?', delayMessage: lastDelayMessage};
                handleSetAnswer(value, enableNextStep, [...messages, newMessage]);
            }else{
                handleSetAnswer(value, enableNextStep, messages ?? []);
            }
        }
    }

    return (
        <BotMessageWrapper>
            {options?.map((radio)=>(
                <RadioField
                    name={ radio.name }
                    id={ radio.name }
                    value={radio.value}
                    onClick={ ()=> handleClick(radio.value) }
                    key={ radio.name }
                >
                    { radio.value }
                </RadioField>
            ))}
        </BotMessageWrapper>
    )
}

export { RadioStep }