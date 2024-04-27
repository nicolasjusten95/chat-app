import {useNavigate} from "react-router-dom";
import React, {Dispatch, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/Store";
import {AuthReducerState, IUpdateUserRequestDTO} from "../../redux/auth/Model";
import {TOKEN} from "../../config/Config";
import {currentUser, updateUser} from "../../redux/auth/Action";
import WestIcon from '@mui/icons-material/West';
import {Avatar, IconButton, TextField} from "@mui/material";
import CreateIcon from '@mui/icons-material/Create';
import CheckIcon from '@mui/icons-material/Check';
import styles from './Profile.module.scss';

const Profile = () => {

    const [flag, setFlag] = useState<boolean>(false);
    const [fullName, setFullName] = useState<string | null>(null);
    const [initials, setInitials] = useState<string>("")
    const navigate = useNavigate();
    const dispatch: Dispatch<any> = useDispatch();
    const state: RootState = useSelector((state: AuthReducerState) => state);
    const token: string | null = localStorage.getItem(TOKEN);

    useEffect(() => {
        if (token) {
            dispatch(currentUser(token));
        }
    }, [token, dispatch]);

    // TODO: Test with name with only 1 initial
    useEffect(() => {
        if (state.reqUser && state.reqUser.fullName) {
            const letters = `${state.reqUser.fullName.split(' ')[0][0]}${state.reqUser.fullName.split(' ')[1][0]}`;
            setInitials(letters);
        }
    }, [state.reqUser]);

    const onCloseProfile = () => {
        navigate("/");
    };

    const onHandleFlag = () => {
        setFlag(true);
    };

    const onHandleCheck = () => {
        if (fullName && token) {
            const data: IUpdateUserRequestDTO = {
                token: token,
                fullName: fullName,
            };
            setFullName(fullName);
            dispatch(updateUser(data));
            setFlag(false);
        }
    };

    const onChangeFullName = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setFullName(e.target.value);
    };

    return (
        <div className={styles.outerContainer}>
            <div className={styles.headingContainer}>
                <IconButton onClick={onCloseProfile}>
                    <WestIcon fontSize='medium'/>
                </IconButton>
                <h2>Profile</h2>
            </div>
            <div className={styles.avatarContainer}>
                <Avatar sx={{width: '15vw', height: '15vw', fontSize: '7vw'}}>{initials}</Avatar>
            </div>
            <div className={styles.nameContainer}>
                {!flag &&
                    <div className={styles.innerNameStaticContainer}>
                        <p className={styles.nameDistance}>{fullName || state.reqUser?.fullName}</p>
                        <IconButton sx={{mr: '0.75rem'}} onClick={onHandleFlag}>
                            <CreateIcon/>
                        </IconButton>
                    </div>}
                {flag &&
                    <div className={styles.innerNameDynamicContainer}>
                        <TextField
                            id="fullName"
                            type="test"
                            label="Enter your full name"
                            variant="outlined"
                            onChange={onChangeFullName}
                            value={fullName}
                            sx={{ml: '0.75rem'}}/>
                        <IconButton sx={{mr: '0.75rem'}} onClick={onHandleCheck}>
                            <CheckIcon/>
                        </IconButton>
                    </div>}
            </div>
            <div className={styles.infoContainer}>
                <p className={styles.infoText}>This name will appear on your messages</p>
            </div>
        </div>
    );
};

export default Profile;