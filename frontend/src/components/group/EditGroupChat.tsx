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

interface CreateGroupProps {
    setIsShowEditGroupChat: (showCreateGroup: boolean) => void;
}

const EditGroupChat = (props: CreateGroupProps) => {

    const [isNewGroup, setIsNewGroup] = useState<boolean>(false);
    const [groupMember, setGroupMember] = useState<Set<UserDTO>>(new Set());
    const [userQuery, setUserQuery] = useState<string>("");
    const dispatch: AppDispatch = useDispatch();
    const token = localStorage.getItem(TOKEN);
    const {auth, chat} = useSelector((state: RootState) => state);
    const [focused, setFocused] = useState<boolean>(false);

    useEffect(() => {
        if (token && userQuery.length > 0) {
            dispatch(searchUser(userQuery, token));
        }
    }, [userQuery, token]);

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
        <>
            <div className={styles.outerEditGroupChatContainer}>
                {!isNewGroup &&
                    <div>
                        {/*Header section*/}
                        <div className={styles.editGroupChatNavContainer}>
                            <IconButton onClick={handleBack}>
                                <WestIcon fontSize='medium'/>

                            </IconButton>
                            <h2>Edit Group Chat</h2>
                        </div>

                        <div>
                            <div>
                                {groupMember.size > 0 && Array.from(groupMember)
                                    .map(member => <GroupMember member={member} onRemoveMember={onRemoveMember}
                                                                key={member.id}/>)
                                }
                            </div>
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
                        <div>
                            {userQuery.length > 0 && auth.searchUser?.map(user => <GroupMember member={user}
                                                                                               onAddMember={onAddMember}
                                                                                               key={user.id}/>)}
                        </div>
                    </div>
                }
            </div>
        </>
    );
};

export default EditGroupChat;