import styles from './CreateSingleChat.module.scss'
import {Button, IconButton, InputAdornment, TextField} from "@mui/material";
import WestIcon from "@mui/icons-material/West";
import React, {useEffect, useState} from "react";
import {UUID} from "node:crypto";
import {createChat, createGroupChat} from "../../redux/chat/ChatAction";
import {TOKEN} from "../../config/Config";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/Store";
import {UserDTO} from "../../redux/auth/AuthModel";
import GroupMember from "./GroupMember";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import {searchUser} from "../../redux/auth/AuthAction";

interface CreateSingleChatProps {
    setIsShowCreateSingleChat: (isShowSingleChat: boolean) => void;
}


const CreateSingleChat = (props: CreateSingleChatProps) => {

    const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null);
    const [focused, setFocused] = useState<boolean>(false);
    const [userQuery, setUserQuery] = useState<string>("");
    const {auth} = useSelector((state: RootState) => state);
    const token = localStorage.getItem(TOKEN);
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        if (token && userQuery.length > 0) {
            dispatch(searchUser(userQuery, token));
        }
    }, [userQuery, token]);

    const onHandleBack = () => {
        props.setIsShowCreateSingleChat(false);
    };

    const onCreate = () => {
        if (token && selectedUser) {
            dispatch(createChat(selectedUser.id, token));
            props.setIsShowCreateSingleChat(false);
        }
    };

    const onChangeQuery = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setUserQuery(e.target.value);
    };

    const onClearQuery = () => {
        setUserQuery("");
    };

    const getSearchEndAdornment = () => {
        return userQuery.length > 0 &&
            <InputAdornment position='end'>
                <IconButton onClick={onClearQuery}>
                    <ClearIcon/>
                </IconButton>
            </InputAdornment>
    };

    const onSetUser = (user: UserDTO) => {
        setSelectedUser(user);
    };

    return (
        <div className={styles.createSingleChatOuterContainer}>
            <div className={styles.createSingleChatNavContainer}>
                <IconButton onClick={onHandleBack}>
                    <WestIcon fontSize='medium'/>
                </IconButton>
                <h2>Create New Chat</h2>
            </div>
            <div className={styles.createSingleChatTextContainer}>
                <p className={styles.createSingleChatText}>Start chat with:</p>
            </div>
            <div className={styles.createSingleChatSelectedUserContainer}>
                {selectedUser && <GroupMember member={selectedUser} key={selectedUser.id}/>}
            </div>
            <div className={styles.createSingleChatTextField}>
                <TextField
                    id='searchUser'
                    type='text'
                    label='Search user to chat ...'
                    size='small'
                    fullWidth
                    value={userQuery}
                    onChange={onChangeQuery}
                    sx={{backgroundColor: 'white'}}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position='start'>
                                <SearchIcon/>
                            </InputAdornment>
                        ),
                        endAdornment: getSearchEndAdornment(),
                    }}
                    InputLabelProps={{
                        shrink: focused || userQuery.length > 0,
                        style: {marginLeft: focused || userQuery.length > 0 ? 0 : 30}
                    }}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}/>
            </div>
            <div className={styles.createSingleChatUserContainer}>
                {userQuery.length > 0 && auth.searchUser?.map(user =>
                    <GroupMember member={user} onAddMember={onSetUser} key={user.id}/>)}
            </div>
            <div className={styles.createSingleChatButton}>
                <Button variant={"contained"} onClick={onCreate}>Create Chat</Button>
            </div>
        </div>
    );
};

export default CreateSingleChat;