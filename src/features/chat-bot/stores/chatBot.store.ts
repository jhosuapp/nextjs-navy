import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import {
  BotInputRequest,
  BotMessage,
  BotOption,
  BotStatus,
} from "../interfaces/chatBot.interface";

interface ChatBotState {
  enableBot: boolean;
  messages: BotMessage[];
  status: BotStatus;
  options: BotOption[];
  input: BotInputRequest | null;
}

interface Actions {
  setEnableBot: (value: boolean) => void;
  addMessage: (message: BotMessage) => void;
  setMessages: (messages: BotMessage[]) => void;
  setStatus: (status: BotStatus) => void;
  setOptions: (options: BotOption[]) => void;
  setInput: (input: BotInputRequest | null) => void;
  reset: (override?: Partial<ChatBotState>) => void;
}

const getInitialState = (): ChatBotState => ({
  enableBot: false,
  messages: [],
  status: "idle",
  options: [],
  input: null,
});

const storeAPI: StateCreator<
  ChatBotState & Actions,
  [["zustand/devtools", never]]
> = (set) => ({
  ...getInitialState(),

  setEnableBot: (value) => set({ enableBot: value }, false, "setEnableBot"),
  addMessage: (message) =>
    set(
      (state) => ({ messages: [...state.messages, message] }),
      false,
      "addMessage",
    ),
  setMessages: (messages) => set({ messages }, false, "setMessages"),
  setStatus: (status) => set({ status }, false, "setStatus"),
  setOptions: (options) => set({ options }, false, "setOptions"),
  setInput: (input) => set({ input }, false, "setInput"),
  reset: (override) =>
    set(() => ({ ...getInitialState(), ...override }), false, "reset"),
});

export const useChatBotStore = create<ChatBotState & Actions>()(
  devtools(storeAPI, { name: "chat-bot-store" }),
);
