import {UUID} from "node:crypto";

export interface MessageDTO {
    id: UUID;
    content: string;
    timeStamp: Date;
}