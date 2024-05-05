import React, {useEffect, useState} from "react";
import {UserDTO} from "../../redux/auth/AuthModel";
import {AppDispatch, RootState} from "../../redux/Store";
import {useDispatch, useSelector} from "react-redux";
import {TOKEN} from "../../config/Config";
import {searchUser} from "../../redux/auth/AuthAction";
import {Button, IconButton, InputAdornment, TextField} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import styles from "./CreateGroupChat.module.scss";
import WestIcon from "@mui/icons-material/West";
import GroupMember from "./GroupMember";
import SearchIcon from "@mui/icons-material/Search";
import {createGroupChat} from "../../redux/chat/ChatAction";
import {UUID} from "node:crypto";

interface CreateGroupChatProps {
    setIsShowCreateGroupChat: (isShowCreateGroupChat: boolean) => void;
}


const CreateGroupChat = (props: CreateGroupChatProps) => {

    const [groupMember, setGroupMember] = useState<Set<UserDTO>>(new Set());
    const [userQuery, setUserQuery] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [focused, setFocused] = useState<boolean>(false);
    const dispatch: AppDispatch = useDispatch();
    const token = localStorage.getItem(TOKEN);
    const {auth} = useSelector((state: RootState) => state);

    useEffect(() => {
        setName("New Group Chat")
    }, []);

    useEffect(() => {
        if (token && userQuery.length > 0) {
            dispatch(searchUser(userQuery, token));
        }
    }, [userQuery, token]);

    useEffect(() => {
        if (auth.reqUser) {
            const newGroupMember: Set<UserDTO> = groupMember.add(auth.reqUser);
            setGroupMember(newGroupMember);
        }
    }, [auth.reqUser, groupMember]);

    const onCreate = () => {
        if (token) {
            const userIds: UUID[] = Array.from(groupMember).map(member => member.id);
            dispatch(createGroupChat({chatName: name, userIds: userIds}, token));
            props.setIsShowCreateGroupChat(false);
        }
    };

    const onRemoveMember = (member: UserDTO) => {
        const updatedMembers: Set<UserDTO> = new Set(groupMember);
        updatedMembers.delete(member);
        setGroupMember(updatedMembers);
    };

    const onAddMember = (member: UserDTO) => {
        const updatedMembers: Set<UserDTO> = new Set(groupMember);
        updatedMembers.add(member);
        setGroupMember(updatedMembers);
    };

    const handleBack = () => {
        props.setIsShowCreateGroupChat(false);
    };

    const onChangeQuery = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setUserQuery(e.target.value);
    };

    const onChangeName = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setName(e.target.value);
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
        <>
            <div className={styles.createGroupChatOuterContainer}>
                <div className={styles.createGroupChatNavContainer}>
                    <IconButton onClick={handleBack}>
                        <WestIcon fontSize='medium'/>
                    </IconButton>
                    <h2>Create New Group Chat</h2>
                </div>
                <div className={styles.createGroupChatTextField}>
                    <TextField
                        id='chatName'
                        type='text'
                        label='Enter name ...'
                        size='small'
                        fullWidth
                        value={name}
                        onChange={onChangeName}
                        sx={{backgroundColor: 'white'}}/>
                </div>
                <p className={styles.createGroupChatText}>User</p>
                <div className={styles.createGroupChatUserContainer}>
                    {groupMember.size > 0 && Array.from(groupMember)
                        .map(member =>
                            <GroupMember member={member} onRemoveMember={onRemoveMember} key={member.id}/>)
                    }
                </div>
                <div className={styles.createGroupChatTextField}>
                    <TextField
                        id='searchUser'
                        type='text'
                        label='Search user to add ...'
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
                <div className={styles.createGroupChatUserContainer}>
                    {userQuery.length > 0 && auth.searchUser?.filter(user =>
                        Array.from(groupMember).filter(member => member.id === user.id).length <= 0)
                        .map(user => <GroupMember member={user} onAddMember={onAddMember} key={user.id}/>)}
                </div>
                <div className={styles.createGroupChatButton}>
                    <Button variant={"contained"} onClick={onCreate}>Create Group Chat</Button>
                </div>
            </div>
        </>
    );
};

export default CreateGroupChat;