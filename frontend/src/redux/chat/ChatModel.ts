import {UUID} from "node:crypto";
import {ApiResponseDTO, UserDTO} from "../auth/AuthModel";
import {MessageDTO} from "../message/MessageModel";

export interface GroupChatRequestDTO {
    userIds: UUID[];
    chatName: string;
}

export interface ChatDTO {
    id: UUID;
    chatName: string;
    isGroup: boolean;
    admins: UserDTO[];
    users: UserDTO[];
    createdBy: UserDTO;
    messages: MessageDTO[];
}

export type ChatReducerState = {
    chats: ChatDTO[];
    createdGroup: ChatDTO | null;
    createdChat: ChatDTO | null;
    deletedChat: ApiResponseDTO | null;
    editedGroup: ChatDTO | null;
    markedAsReadChat: ChatDTO | null;
}