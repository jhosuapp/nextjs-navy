import { useEffect } from "react";
import { useChatBotStore } from "../stores/chatBot.store";
import { useUpdateUsernameMutation, useUserNameQuery } from "./useUserNameQuery"
import { GlobalFuncsForHooks } from "../interfaces/chatBot.interface";

const useUserNameController = ({ setMessage, setIsLoad, scrollToBottom }:GlobalFuncsForHooks) => {
    const messagesSaved = useChatBotStore( state => state.messagesSaved );
    const response = useUserNameQuery(messagesSaved.uuid);
    const mutation = useUpdateUsernameMutation();

    useEffect(()=>{
        if(response.isLoading){
            setIsLoad(true);
        }else {
            setIsLoad(false);
        }
    },[response.isLoading]);

    useEffect(()=>{
        if(response.isSuccess && response.data?.username && response.data?.uuid){
            const { username, uuid } = response.data;
            setMessage({
                text: `${response.data.username}, We are currently updating your user name`,
                userResponse: false,
                delayMessage: 0.2
            });
            setIsLoad(true);
            setTimeout(async()=>{
                scrollToBottom();
                try{
                    await mutation.mutateAsync({ nick: username, uuid });
                    setMessage({
                        text: `Your username has been successfully updated`,
                        userResponse: false,
                        delayMessage: 0.2
                    });
                }catch(error){
                    setMessage({
                        text: `The username exists in NameMC but not in our databases`,
                        userResponse: false,
                        delayMessage: 0.2
                    });
                }finally{
                    setIsLoad(false);
                    setTimeout(()=>{
                        scrollToBottom();
                    },500);
                }
            },500);
        }

        if(response.isError && !response.data?.username){
            setMessage({
                text: `Sorry, the UUID entered is not valid`,
                userResponse: false,
                delayMessage: 0.2
            });
        }
    },[response.data, response.isSuccess, response.isError]);

    return {
        messagesSaved,
        response
    }
}

export { useUserNameController }