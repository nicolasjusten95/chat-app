import reducer from "./auth/Reducer";
import {AuthAction, AuthReducerState, DispatchType} from "./auth/Model";
import {applyMiddleware, legacy_createStore, Store} from "redux";
import {thunk} from "redux-thunk";

export const store: Store<AuthReducerState, AuthAction> & {
    dispatch: DispatchType
} = legacy_createStore(reducer, applyMiddleware(thunk));

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
