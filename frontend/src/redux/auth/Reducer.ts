import {AuthAction, AuthReducerState} from "./Model";
import * as actionTypes from './ActionType';

const initialState: AuthReducerState = {
    signin: null,
    signup: null,
    reqUser: null,
    searchUser: null,
    updateUser: null,
};

const authReducer = (state: AuthReducerState = initialState, action: AuthAction): AuthReducerState => {
    switch (action.type) {
        case actionTypes.REGISTER:
            return {...state, signup: action.payload};
        case actionTypes.LOGIN_USER:
            return {...state, signin: action.payload};
        case actionTypes.REQ_USER:
            return {...state, reqUser: action.payload};
        case actionTypes.SEARCH_USER:
            return {...state, searchUser: action.payload};
        case actionTypes.UPDATE_USER:
            return {...state, updateUser: action.payload};
        case actionTypes.LOGOUT_USER:
            return {...state, signin: null, signup: null, reqUser: null};
    }
    return state;
};

export default authReducer;