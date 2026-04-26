import type { JSX } from "react";
import { useChatBotStore } from "@/features/chat-bot/stores/chatBot.store";
import { RadioStep } from "../radio-step/RadioStep";

const noMessages = [{ text: "Okay, I hope I've helped you.", delayMessage: 1.5 }, { text: 'You can now close this chat.', delayMessage: 3.5 }];

const resetFluxOptions = [
    { name: 'Yes', value: 'yes' }, 
    { name: 'No', value: 'no' }
]

const ResetFlux = ():JSX.Element => {
    const reloadInitialOptions = useChatBotStore(state => state.reloadInitialOptions);
    const setReloadInitialOptions = useChatBotStore(state => state.setReloadInitialOptions);

    const handleClickStepResetFlux = (value: string) => {
        if(value === 'yes'){
            setReloadInitialOptions({ ...reloadInitialOptions, reload: true });
            return [];
        }else{
            setReloadInitialOptions({ ...reloadInitialOptions, enabled: false });
            return noMessages;
        }
    }

    if(!reloadInitialOptions.enabled){
        return <></>
    }

    return (
        <RadioStep
            options={ resetFluxOptions } 
            enableAtStep={2} // Not apply because enableInAnyStep is true
            enableNextStep={3} // Not apply because enableInAnyStep is true
            enableInAnyStep
            rowDirection
            callBackHandleClick={handleClickStepResetFlux}
        />
    )
}

export { ResetFlux }