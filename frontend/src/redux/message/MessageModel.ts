import {UUID} from "node:crypto";

export interface MessageDTO {
    id: UUID;
    content: string;
    timeStamp: Date;
}

export interface SendMessageRequestDTO {
    chatId: UUID;
    content: string;
}

export type MessageReducerState = {
    messages: MessageDTO[];
    newMessage: MessageDTO | null;
}