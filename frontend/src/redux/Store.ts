import {applyMiddleware, combineReducers, legacy_createStore} from "redux";
import {thunk} from "redux-thunk";

const rootReducer = combineReducers({

});

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));
