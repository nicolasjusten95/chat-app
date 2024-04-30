import {UUID} from "node:crypto";

export interface SignUpRequestDTO {
    email: string,
    password: string,
    fullName: string,
}

export interface UpdateUserRequestDTO {
    email?: string,
    password?: string,
    fullName: string,
}

export interface LoginResponseDTO {
    token: string,
    isAuthenticated: boolean,
}

export interface LoginRequestDTO {
    email: string,
    password: string,
}

export interface UserDTO {
    id: UUID,
    email: string,
    fullName: string,
}

export interface ApiResponseDTO {
    message: string,
    status: boolean,
}

export type AuthReducerState = {
    signin: LoginResponseDTO | null,
    signup: LoginResponseDTO | null,
    reqUser: UserDTO | null,
    searchUser: UserDTO[] | null,
    updateUser: ApiResponseDTO | null,
}