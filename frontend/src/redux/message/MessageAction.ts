import {MessageDTO, SendMessageRequestDTO} from "./MessageModel";
import {AppDispatch} from "../Store";
import {BASE_API_URL} from "../../config/Config";
import {AUTHORIZATION_PREFIX} from "../Constants";
import * as actionTypes from './MessageActionType';
import {UUID} from "node:crypto";

const MESSAGE_PATH = 'api/messages';

export const createMessage = (data: SendMessageRequestDTO, token: string) => async (dispatch: AppDispatch): Promise<void> => {
    try {
        const res: Response = await fetch(`${BASE_API_URL}/${MESSAGE_PATH}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${AUTHORIZATION_PREFIX}${token}`,
            },
            body: JSON.stringify(data),
        });

        const resData: MessageDTO = await res.json();
        console.log('Send message: ', resData);
        dispatch({type: actionTypes.CREATE_NEW_MESSAGE, payload: resData});
    } catch (error: any) {
        console.error('Sending message failed', error);
    }
};

export const getAllMessages = (chatId: UUID, token: string) => async (dispatch: AppDispatch): Promise<void> => {
    try {
        const res: Response = await fetch(`${BASE_API_URL}/${MESSAGE_PATH}/chat/${chatId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${AUTHORIZATION_PREFIX}${token}`,
            }
        });

        const resData: MessageDTO[] = await res.json();
        console.log('Getting messages: ', resData);
        dispatch({type: actionTypes.GET_ALL_MESSAGES, payload: resData});
    } catch (error: any) {
        console.error('Getting messages failed: ', error);
    }
};