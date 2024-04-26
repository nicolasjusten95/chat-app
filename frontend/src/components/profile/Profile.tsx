import {useNavigate} from "react-router-dom";
import React, {Dispatch, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/Store";
import {AuthReducerState, IUpdateUserRequestDTO} from "../../redux/auth/Model";
import {TOKEN} from "../../config/Config";
import {updateUser} from "../../redux/auth/Action";
import WestIcon from '@mui/icons-material/West';
import {Avatar, IconButton, TextField} from "@mui/material";
import CreateIcon from '@mui/icons-material/Create';
import CheckIcon from '@mui/icons-material/Check';

const Profile = () => {

    const [flag, setFlag] = useState<boolean>(false);
    const [fullName, setFullName] = useState<string | null>(null);
    const [initials, setInitials] = useState<string>("")
    const navigate = useNavigate();
    const dispatch: Dispatch<any> = useDispatch();
    const state: RootState = useSelector((state: AuthReducerState) => state);

    useEffect(() => {
        const letters = `${state.reqUser?.fullName.split(' ')[0][0]}${state.reqUser?.fullName.split(' ')[1][0]}`;
        console.log(letters);
        console.log(state.reqUser);
        setInitials(letters);
    }, [state]);

    const onCloseProfile = () => {
        navigate("/");
    };

    const onHandleFlag = () => {
        setFlag(true);
    };

    const onHandleCheck = () => {
        const token = localStorage.getItem(TOKEN);
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
        <div>
            <div>
                <IconButton onClick={onCloseProfile}>
                    <WestIcon/>
                </IconButton>
                <p>Profile</p>
            </div>
            <div>
                <Avatar>{initials}</Avatar>
            </div>
            <div>
                <p></p>
                {!flag &&
                    <div>
                        <p>{fullName || state.reqUser?.fullName}</p>
                        <IconButton onClick={onHandleFlag}>
                            <CreateIcon/>
                        </IconButton>
                    </div>}
                {flag &&
                    <div>
                        <TextField
                            id="fullName"
                            type="test"
                            label="Enter your full name"
                            variant="outlined"
                            onChange={onChangeFullName}
                            value={fullName}/>
                        <IconButton onClick={onHandleCheck}>
                            <CheckIcon/>
                        </IconButton>
                    </div>}
            </div>
            <div>
                <p>This name will appear on your message</p>
            </div>
        </div>
    );
};

export default Profile;