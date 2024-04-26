import {EAuthActionType} from "./ActionType";
import {IAuthReducerAction, IAuthReducerState} from "./Model";

const initialState: IAuthReducerState = {
    signin: null,
    signup: null,
    reqUser: null,
    searchUser: null,
    updateUser: null,
};

export const authReducer = (state: IAuthReducerState = initialState, action: IAuthReducerAction): IAuthReducerState => {
    switch (action.type) {
        case EAuthActionType.REGISTER:
            return {...state, signup: action.payload};
        case EAuthActionType.LOGIN_USER:
            return {...state, signin: action.payload};
        case EAuthActionType.REQ_USER:
            return {...state, reqUser: action.payload};
        case EAuthActionType.SEARCH_USER:
            return {...state, searchUser: action.payload};
        case EAuthActionType.UPDATE_USER:
            return {...state, updateUser: action.payload};
        case EAuthActionType.LOGOUT_USER:
            return {...state, signin: null, signup: null, reqUser: null};
    }
}