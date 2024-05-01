import {UUID} from "node:crypto";
import {UserDTO} from "../auth/AuthModel";

export interface MessageDTO {
    id: UUID;
    content: string;
    timeStamp: string;
    user: UserDTO;
}

export interface SendMessageRequestDTO {
    chatId: UUID;
    content: string;
}

export type MessageReducerState = {
    messages: MessageDTO[];
    newMessage: MessageDTO | null;
}