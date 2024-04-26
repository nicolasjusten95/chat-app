import {BASE_API_URL, TOKEN} from '../../config/Config.js';
import {
    IApiResponseDTO,
    ILoginRequestDTO,
    ILoginResponseDTO,
    ISearchUserRequestDTO, ISignUpRequestDTO,
    IUpdateUserRequestDTO,
    IUserResponseDTO
} from "./Model";
import {EAuthActionType} from "./ActionType";

const AUTH_PATH = 'auth';
const USER_PATH = 'api/users';

export const register = (data: ISignUpRequestDTO) => async (dispatch: any): Promise<void> => {
    try {
        const res: Response = await fetch(`${BASE_API_URL}/${AUTH_PATH}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const resData: ILoginResponseDTO = await res.json();
        if (resData.token) {
            localStorage.setItem(TOKEN, resData.token);
            console.log('Stored token');
        }
        console.log('User registered: ', resData);
        dispatch({type: EAuthActionType.REGISTER, payload: resData});
    } catch (error: any) {
        console.error('Register failed: ', error);
    }
};

export const loginUser = (data: ILoginRequestDTO) => async (dispatch: any): Promise<void> => {
    try {
        const res: Response = await fetch(`${BASE_API_URL}/${AUTH_PATH}/signin`, {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json',
           },
            body: JSON.stringify(data),
        });

        const resData: ILoginResponseDTO = await res.json();
        if (resData.token) {
            localStorage.setItem(TOKEN, resData.token);
            console.log('Stored token');
        }
        console.log('User logged in: ', resData);
        dispatch({type: EAuthActionType.LOGIN_USER, payload: resData});
    } catch (error: any) {
        console.error('Login failed: ', error);
    }
};

export const currentUser = (token: string) => async (dispatch: any): Promise<void> => {
    try {
        const res: Response = await fetch(`${BASE_API_URL}/${USER_PATH}/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const resData: IUserResponseDTO = await res.json();
        console.log('Fetched current user: ', currentUser);
        dispatch({type: EAuthActionType.REQ_USER, payload: resData});
    } catch (error: any) {
        console.error('Fetching user data failed: ', error);
    }
};

export const searchUser = (data: ISearchUserRequestDTO) => async (dispatch: any): Promise<void> => {
    try {
        const res: Response = await fetch(`${BASE_API_URL}/${USER_PATH}/search?name=${data.keyword}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.token}`,
            }
        });

        const resData: IUserResponseDTO[] = await res.json();
        console.log('Searched user data: ', resData);
        dispatch({type: EAuthActionType.SEARCH_USER, payload: resData});
    } catch (error: any) {
        console.error('Searching user failed: ', error);
    }
};

export const updateUser = (data: IUpdateUserRequestDTO) => async (dispatch: any): Promise<void> => {
    try {
        const res = await fetch(`${BASE_API_URL}/${USER_PATH}/update`, {
           method: 'PUT',
           headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${data.token}`,
           },
           body: JSON.stringify(data),
        });

        const resData: IApiResponseDTO = await res.json();
        console.log('User updated: ', resData);
        dispatch({type: EAuthActionType.UPDATE_USER, payload: resData});
    } catch (error: any) {
        console.error('Update user failed: ', error);
    }
};

export const logoutUser = () => async (dispatch: any): Promise<void> => {
    localStorage.removeItem(TOKEN);
    dispatch({type: EAuthActionType.LOGOUT_USER, payload: null});
    dispatch({type: EAuthActionType.REQ_USER, payload: null});
    console.log('User logged out');
}