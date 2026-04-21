import type { JSX } from "react";
import { RadioStep } from "../radio-step/RadioStep";

const Steps = ():JSX.Element => {
    return (
        <>
            <RadioStep
                options={[{ name: 'oldUserName', value: 'My old username appears' }]} 
                messages={[{ text: 'Let"s update it!', delayMessage: 1.5 }, { text: 'But first, select one of the following options:', delayMessage: 3.5 }]}
                enableAtStep={1}
                enableNextStep={2}
            />
            <RadioStep 
                options={[{ name: 'joinDiscord', value: 'I want to join the Discord server' }]} 
                messages={[{ text: 'This is our discord channel:', delayMessage: 1.5 }, { text: 'https://discord.com/invite/navyy', delayMessage: 3.5 }]}
                enableAtStep={1}
                enableNextStep={200000}
                resetFlux
            />
        </>
    )
}

export { Steps }