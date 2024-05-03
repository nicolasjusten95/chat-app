import {BASE_API_URL} from "../../config/Config";
import * as actionTypes from './ChatActionType';
import {UUID} from "node:crypto";
import {ChatDTO, GroupChatRequestDTO} from "./ChatModel";
import {AUTHORIZATION_PREFIX} from "../Constants";
import {AppDispatch} from "../Store";

const CHAT_PATH = 'api/chats';

export const createChat = (data: UUID, token: string) => async (dispatch: AppDispatch): Promise<void> => {
    try {
        const res: Response = await fetch(`${BASE_API_URL}/${CHAT_PATH}/single`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${AUTHORIZATION_PREFIX}${token}`,
            },
            body: JSON.stringify(data),
        });

        const resData: ChatDTO = await res.json();
        console.log('Created single chat: ', resData);
        dispatch({type: actionTypes.CREATE_CHAT, payload: resData});
    } catch (error: any) {
        console.error('Creating single chat failed: ', error);
    }
};

export const createGroupChat = (data: GroupChatRequestDTO, token: string) => async (dispatch: AppDispatch): Promise<void> => {
    try {
        const res: Response = await fetch(`${BASE_API_URL}/${CHAT_PATH}/group`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${AUTHORIZATION_PREFIX}${token}`,
            },
            body: JSON.stringify(data),
        });

        const resData: ChatDTO = await res.json();
        console.log('Created group chat: ', resData);
        dispatch({type: actionTypes.CREATE_GROUP, payload: resData});
    } catch (error: any) {
        console.error('Creating group chat failed: ', error);
    }
};

export const getUserChats = (token: string) => async (dispatch: AppDispatch): Promise<void> => {
    try {
        const res: Response = await fetch(`${BASE_API_URL}/${CHAT_PATH}/user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${AUTHORIZATION_PREFIX}${token}`,
            }
        });

        const resData: ChatDTO[] = await res.json();
        console.log('Getting user chats: ', resData);
        dispatch({type: actionTypes.GET_ALL_CHATS, payload: resData});
    } catch (error: any) {
        console.error('Getting user chats failed ', error);
    }
};