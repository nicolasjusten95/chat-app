import {TOKEN} from "../../config/Config";
import {useDispatch, useSelector} from "react-redux";
import {AuthReducerState, ILoginRequestDTO} from "../../redux/auth/Model";
import {useNavigate} from "react-router-dom";
import React, {Dispatch, useEffect, useState} from "react";
import {currentUser, loginUser} from "../../redux/auth/Action";
import {RootState} from "../../redux/Store";
import {Button, TextField} from "@mui/material";
import styles from "./Register.module.scss";


const SignIn = () => {

    const [signInData, setSignInData] = useState<ILoginRequestDTO>({email: "", password: ""});
    const navigate = useNavigate();
    const dispatch: Dispatch<any> = useDispatch();
    const token: string | null = localStorage.getItem(TOKEN);
    const state: RootState = useSelector((state: AuthReducerState) => state);

    useEffect(() => {
        if (token) {
            dispatch(currentUser(token));
        }
    }, [token, state.reqUser, dispatch]);

    useEffect(() => {
        if (state.reqUser) {
            navigate("/");
        }
    }, [state, navigate]);

    const onSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Sign in form submitted");
        dispatch(loginUser(signInData));
    };

    const onChangeEmail = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setSignInData({...signInData, email: e.target.value});
    };

    const onChangePassword = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setSignInData({...signInData, password: e.target.value});
    };

    const onClickCreateNewAccount = (e: any) => {
        navigate("/signup");
    };

    return (
        <div>
            <div className={styles.outerContainer}>
                <div className={styles.innerContainer}>
                    <form onSubmit={onSubmit}>
                        <div>
                            <p className={styles.text}>Email</p>
                            <TextField
                                className={styles.textInput}
                                id="email"
                                type="email"
                                label="Enter your email"
                                variant="outlined"
                                onChange={onChangeEmail}
                                value={signInData.email}/>
                        </div>
                        <div>
                            <p className={styles.text}>Password</p>
                            <TextField
                                className={styles.textInput}
                                id="password"
                                type="password"
                                label="Enter your password"
                                variant="outlined"
                                onChange={onChangePassword}
                                value={signInData.password}/>
                        </div>
                        <div className={styles.button}>
                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                type="submit">
                                Sign in
                            </Button>
                        </div>
                    </form>
                    <div className={styles.bottomContainer}>
                        <p> Create new account</p>
                        <Button variant='text' size='large' onClick={onClickCreateNewAccount}>Signup</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
