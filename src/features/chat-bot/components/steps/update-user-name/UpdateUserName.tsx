import { useChatBotStore } from "@/features/chat-bot/stores/chatBot.store";
import { RadioStep } from "../radio-step/RadioStep";

const premiumMessages = [{ text: 'Now, enter your namemc uuid.', delayMessage: 1.5 }];
const noPremiumMessages = [
    { text: "I'm sorry", delayMessage: 1.5 }, 
    { text: 'We cannot update your username because you must have a premium account.', delayMessage: 3.5 }
];
const premiumOptions = [
    { name: 'Im premium', value: 'Im premium' }, 
    { name: 'Im not premium', value: 'Im not premium' }
]

const UpdateUserName = ():JSX.Element => {
    const setUpdateUserNameData = useChatBotStore(state => state.setUpdateUserNameData);
    const setIsChatEnabled = useChatBotStore(state => state.setIsChatEnabled);
    const setAtrFieldAnswer = useChatBotStore(state => state.setAtrFieldAnswer);

    const handleClickStepPremium = (value: string) => {
        setUpdateUserNameData({ isPremium: value });
        if(value === 'Im premium'){
            setIsChatEnabled(true);
            setAtrFieldAnswer({ name: 'uuid', placeholder: 'Write your uuid here'});
            return premiumMessages;
        }else{
            return noPremiumMessages;
        }
    }

    return (
        <RadioStep
            options={ premiumOptions } 
            enableAtStep={2}
            enableNextStep={3}
            callBackHandleClick={handleClickStepPremium}
        />
    )
}

export { UpdateUserName }