import {TOKEN} from "../../config/Config";
import {useDispatch, useSelector} from "react-redux";
import {AuthReducerState, ILoginRequestDTO} from "../../redux/auth/Model";
import {useNavigate} from "react-router-dom";
import React, {Dispatch, useEffect, useState} from "react";
import {currentUser, loginUser} from "../../redux/auth/Action";
import {RootState} from "../../redux/Store";
import {Button, TextField} from "@mui/material";


const SignIn = () => {

    const [isOpenSnackBar, setIsOpenSnackBar] = useState<boolean>(false);
    const [signInData, setSignInData] = useState<ILoginRequestDTO>({email: "", password: ""})
    const navigate = useNavigate();
    const dispatch: Dispatch<any> = useDispatch();
    const token: string | null = localStorage.getItem(TOKEN);
    const state: RootState = useSelector((state: AuthReducerState) => state);

    useEffect(() => {
        if (token) {
            console.log('Found token: ', token);
            dispatch(currentUser(token));
        }
    }, [token, state.reqUser, dispatch]);

    useEffect(() => {
        if (state.reqUser) {
            console.log('User is logged in. Navigating to homepage.')
            navigate("/");
        }
    }, [state, navigate]);

    const onSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Sign in form submitted');
        dispatch(loginUser(signInData));
    };

    const onChangeEmail = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setSignInData({...signInData, email: e.target.value});
    };

    const onChangePassword = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setSignInData({...signInData, password: e.target.value});
    };

    const onClickCreateNewAccount = (e: any) => {
        console.log('Navigating to signup page.')
        navigate("/signup");
    };

    return (
        <div>
            <div>
                <div>
                    <form onSubmit={onSubmit}>
                        <TextField id="outlined-basic" label="Email" variant="outlined" onChange={onChangeEmail} />
                        <TextField id="outlined-basic" label="Password" variant="outlined" onChange={onChangePassword} />
                        <Button variant="contained" type="submit">Sign in</Button>
                    </form>
                    <Button variant="text" onClick={onClickCreateNewAccount}>Create new account</Button>
                </div>
            </div>
        </div>
    );
}

export default SignIn;