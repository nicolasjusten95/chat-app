import {EAuthActionType} from "./ActionType";
import {UUID} from "node:crypto";

export interface IAuthReducerState {
    signin: ILoginResponseDTO | null,
    signup: ILoginResponseDTO | null,
    reqUser: IUserResponseDTO | null,
    searchUser: IUserResponseDTO[] | null,
    updateUser: IApiResponseDTO | null,
}

export interface IAuthReducerAction {
    type: EAuthActionType,
    payload: any,
}

export interface ISignUpRequestDTO {
    email: string,
    password: string,
    fullName: string,
}

export interface IUpdateUserRequestDTO {
    email: string,
    password: string,
    fullName: string,
    token: string,
}

export interface ILoginResponseDTO {
    token: string,
    isAuthenticated: boolean,
}

export interface ILoginRequestDTO {
    email: string,
    password: string,
}

export interface IUserResponseDTO {
    id: UUID,
    email: string,
    fullName: string,
}

export interface ISearchUserRequestDTO {
    token: string,
    keyword: string,
}

export interface IApiResponseDTO {
    message: string,
    status: boolean,
}