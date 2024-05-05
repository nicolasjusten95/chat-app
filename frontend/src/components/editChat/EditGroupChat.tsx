import React, {useEffect, useState} from "react";
import {AppDispatch, RootState} from "../../redux/Store";
import {useDispatch, useSelector} from "react-redux";
import {TOKEN} from "../../config/Config";
import {UserDTO} from "../../redux/auth/AuthModel";
import {searchUser} from "../../redux/auth/AuthAction";
import {IconButton, InputAdornment, TextField} from "@mui/material";
import WestIcon from "@mui/icons-material/West";
import styles from './EditGroupChat.module.scss';
import GroupMember from "./GroupMember";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import {ChatDTO} from "../../redux/chat/ChatModel";
import {addUserToGroupChat, removeUserFromGroupChat} from "../../redux/chat/ChatAction";

interface CreateGroupProps {
    setIsShowEditGroupChat: (showCreateGroup: boolean) => void;
    currentChat: ChatDTO | null;
}

const EditGroupChat = (props: CreateGroupProps) => {

    const [userQuery, setUserQuery] = useState<string>("");
    const [focused, setFocused] = useState<boolean>(false);
    const dispatch: AppDispatch = useDispatch();
    const token = localStorage.getItem(TOKEN);
    const {auth} = useSelector((state: RootState) => state);

    useEffect(() => {
        if (token && userQuery.length > 0) {
            dispatch(searchUser(userQuery, token));
        }
    }, [userQuery, token]);

    const onRemoveMember = (user: UserDTO) => {
        if (token && props.currentChat) {
            dispatch(removeUserFromGroupChat(props.currentChat.id, user.id, token));
        }
    };

    const onAddMember = (user: UserDTO) => {
        if (token && props.currentChat) {
            dispatch(addUserToGroupChat(props.currentChat.id, user.id, token));
        }
    };

    const handleBack = () => {
        props.setIsShowEditGroupChat(false);
    };

    const onChangeQuery = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setUserQuery(e.target.value);
    };

    const onClearQuery = () => {
        setUserQuery("");
    }

    const getSearchEndAdornment = () => {
        return userQuery.length > 0 &&
            <InputAdornment position='end'>
                <IconButton onClick={onClearQuery}>
                    <ClearIcon/>
                </IconButton>
            </InputAdornment>
    };

    return (
        <div className={styles.outerEditGroupChatContainer}>
            <div className={styles.editGroupChatNavContainer}>
                <IconButton onClick={handleBack}>
                    <WestIcon fontSize='medium'/>
                </IconButton>
                <h2>Edit Group Chat</h2>
            </div>
            <div>
                <div className={styles.editGroupChatTextContainer}>
                    <p className={styles.editGroupChatText}>Remove user</p>
                </div>
                <div className={styles.editGroupChatUserContainer}>
                    {props.currentChat?.users.map(user =>
                        <GroupMember member={user} onRemoveMember={onRemoveMember} key={user.id}/>)
                    }
                </div>
                <div className={styles.editGroupChatTextContainer}>
                    <p className={styles.editGroupChatText}>Add user</p>
                </div>
                <div className={styles.editGroupChatTextField}>
                    <TextField
                        id='searchUser'
                        type='text'
                        label='Search user ...'
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
            </div>
            <div className={styles.editGroupChatUserContainer}>
                {userQuery.length > 0 && auth.searchUser?.filter(user => {
                    const existingUser = props.currentChat?.users.find(existingUser => existingUser.id === user.id);
                    return existingUser === undefined;
                })
                    .map(user => <GroupMember member={user} onAddMember={onAddMember} key={user.id}/>)}
            </div>
        </div>
    );
};

export default EditGroupChat;