import type { JSX } from "react";
import { RadioField } from "@/shared/components/radio-field/RadioField"
import { BotMessageWrapper } from "../../bot-message/BotMessageWrapper"
import { useRadioStepController } from "@/features/chat-bot/hooks/useRadioStep.controller";
import { ItemBotMessage } from "@/features/chat-bot/interfaces/chatBot.interface";
import { useChatBotStore } from "@/features/chat-bot/stores/chatBot.store";

type Props = {
    options: {
        name: string;
        value: string;
    }[];
    messages?: ItemBotMessage[] | null;
    enableAtStep: number;
    enableNextStep: number;
    resetFlux?: boolean;
    enableInAnyStep?: boolean;
    rowDirection?: boolean;
    callBackHandleClick?: (value:string)=> ItemBotMessage[];
}

const RadioStep = ({ 
    options, 
    enableAtStep, 
    enableNextStep, 
    messages, 
    callBackHandleClick, 
    resetFlux = false, 
    enableInAnyStep = false, 
    rowDirection = false 
}:Props):JSX.Element => {

    const { 
        currentStep, 
        handleClick
    } = useRadioStepController({ enableNextStep, messages, callBackHandleClick, resetFlux, enableInAnyStep });


    if(currentStep !== enableAtStep && !enableInAnyStep){
        return <></>
    }

    return (
        <BotMessageWrapper rowDirection={rowDirection}>
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