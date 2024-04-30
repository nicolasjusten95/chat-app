import styles from './Register.module.scss'
import {useNavigate} from "react-router-dom";
import React, {Dispatch, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {TOKEN} from "../../config/Config";
import {RootState} from "../../redux/Store";
import {AuthReducerState, SignUpRequestDTO} from "../../redux/auth/AuthModel";
import {currentUser, register} from "../../redux/auth/AuthAction";
import {Button, TextField} from "@mui/material";


// TODO: Verify email
// TODO: Check if account already exists
// TODO: Show error if something went wrong
const SignUp = () => {

    const [createAccountData, setCreateAccountData] = useState<SignUpRequestDTO>({
        fullName: "",
        email: "",
        password: ""
    });
    const navigate = useNavigate();
    const dispatch: Dispatch<any> = useDispatch();
    const token: string | null = localStorage.getItem(TOKEN);
    const state: AuthReducerState = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (token && !state.reqUser) {
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
        console.log("Sign up form submitted");
        dispatch(register(createAccountData));
    };

    const onChangeFullName = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setCreateAccountData({...createAccountData, fullName: e.target.value});
    };

    const onChangeEmail = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setCreateAccountData({...createAccountData, email: e.target.value});
    }

    const onChangePassword = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setCreateAccountData({...createAccountData, password: e.target.value});
    };

    const onNavigateToSignIn = () => {
        navigate("/signin");
    }

    return (
        <div>
            <div className={styles.outerContainer}>
                <div className={styles.innerContainer}>
                    <form onSubmit={onSubmit}>
                        <div>
                            <p className={styles.text}>Full Name</p>
                            <TextField
                                className={styles.textInput}
                                id="fullName"
                                type="text"
                                label="Enter your full name"
                                variant="outlined"
                                onChange={onChangeFullName}
                                value={createAccountData.fullName}/>
                        </div>
                        <div>
                            <p className={styles.text}>Email</p>
                            <TextField
                                className={styles.textInput}
                                id="email"
                                type="email"
                                label="Enter your email"
                                variant="outlined"
                                onChange={onChangeEmail}
                                value={createAccountData.email}/>
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
                                value={createAccountData.password}/>
                        </div>
                        <div className={styles.button}>
                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                type="submit">
                                Sign up
                            </Button>
                        </div>
                    </form>
                    <div className={styles.bottomContainer}>
                        <p>Already signed up?</p>
                        <Button variant='text' size='large' onClick={onNavigateToSignIn}>Login</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;