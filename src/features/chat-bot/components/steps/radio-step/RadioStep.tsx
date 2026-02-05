import { RadioField } from "@/shared/components"
import { BotMessageWrapper } from "../../bot-message/BotMessageWrapper"
import { useRadioStepController } from "@/features/chat-bot/hooks/useInitialOptions.controller";
import { ItemBotMessage } from "@/features/chat-bot/interfaces/chatBot.interface";

type Props = {
    options: {
        name: string;
        value: string;
    }[];
    messages: ItemBotMessage[];
    enableAtStep: number;
    enableNextStep: number;
}

const RadioStep = ({ options, enableAtStep, enableNextStep, messages }:Props):JSX.Element => {
    const { handleSetAnswer, currentStep } = useRadioStepController({ messages });

    if(currentStep !== enableAtStep){
        return <></>
    }
    
    return (
        <BotMessageWrapper>
            {options?.map((radio)=>(
                <RadioField
                    name={ radio.name }
                    id={ radio.name }
                    value={radio.value}
                    onClick={ ()=> handleSetAnswer(radio.value, enableNextStep) }
                    key={ radio.name }
                >
                    { radio.value }
                </RadioField>
            ))}
        </BotMessageWrapper>
    )
}

export { RadioStep }