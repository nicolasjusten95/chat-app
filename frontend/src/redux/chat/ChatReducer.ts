import * as actionTypes from './ChatActionType';
import {ChatReducerState} from "./ChatModel";
import {Action} from "../CommonModel";

const initialState: ChatReducerState = {
    chats: [],
    createdGroup: null,
    createdChat: null,
};

const chatReducer = (state: ChatReducerState = initialState, action: Action): ChatReducerState => {
    switch (action.type) {
        case actionTypes.CREATE_CHAT:
            return {...state, createdChat: action.payload};
        case actionTypes.CREATE_GROUP:
            return {...state, createdGroup: action.payload};
        case actionTypes.GET_ALL_CHATS:
            return {...state, chats: action.payload};
    }
    return state;
};

export default chatReducer;