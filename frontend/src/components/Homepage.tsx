import styles from './Homepage.module.scss';
import React, {Dispatch, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../redux/Store";
import {TOKEN} from "../config/Config";
import CreateGroup from "./group/CreateGroup";
import Profile from "./profile/Profile";
import {Avatar, IconButton, InputAdornment, Menu, MenuItem, TextField} from "@mui/material";
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {currentUser, logoutUser} from "../redux/auth/AuthAction";
import SearchIcon from '@mui/icons-material/Search';
import {getUserChat} from "../redux/chat/ChatAction";
import {ChatDTO} from "../redux/chat/ChatModel";
import ChatCard from "./chatCard/ChatCard";
import {getInitialsFromName} from "./utils/Utils";
import ClearIcon from '@mui/icons-material/Clear';

const Homepage = () => {

    const [isShowCreateGroup, setIsShowCreateGroup] = useState<boolean>(false);
    const [isShowProfile, setIsShowProfile] = useState<boolean>(false);
    const [anchor, setAnchor] = useState(null);
    const [initials, setInitials] = useState<string>("");
    const [query, setQuery] = useState<string>("");
    const [focused, setFocused] = useState<boolean>(false);
    const open = Boolean(anchor);
    const navigate = useNavigate();
    const dispatch: Dispatch<any> = useDispatch();
    const {auth, chat, message} = useSelector((state: RootState) => state);
    const token: string | null = localStorage.getItem(TOKEN);

    useEffect(() => {
        if (token && !auth.reqUser) {
            dispatch(currentUser(token));
        }
    }, [token, dispatch, auth.reqUser, navigate]);

    useEffect(() => {
        if (!token) {
            navigate("/signin");
        }
    }, [token, navigate]);

    useEffect(() => {
        if (auth.reqUser && auth.reqUser.fullName) {
            const letters = getInitialsFromName(auth.reqUser.fullName);
            setInitials(letters);
        }
    }, [auth.reqUser]);

    useEffect(() => {
        if (token) {
            dispatch(getUserChat(token));
        }
    }, [chat.createdChat, chat.createdGroup, dispatch, token, message.newMessage]);

    const onOpenProfile = () => {
        onCloseMenu();
        setIsShowProfile(true);
    };

    const onCloseProfile = () => {
        setIsShowProfile(false);
    };

    const onOpenMenu = (e: any) => {
        setAnchor(e.currentTarget);
    };

    const onCloseMenu = () => {
        setAnchor(null);
    };

    const onCreateGroup = () => {
        setIsShowCreateGroup(true);
    };

    const onLogout = () => {
        dispatch(logoutUser());
        navigate("/signin");
    };

    const onChangeQuery = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setQuery(e.target.value.toLowerCase());
    };

    const onClearQuery = () => {
        setQuery("");
    };

    const getSearchEndAdornment = () => {
        return query.length > 0 &&
            <InputAdornment position='end'>
            <IconButton onClick={onClearQuery}>
                <ClearIcon/>
            </IconButton>
        </InputAdornment>
    }

    return (
        <div>
            <div className={styles.outerContainer}>
                <div className={styles.innerContainer}>
                    <div className={styles.sideBarContainer}>
                        {isShowCreateGroup && <CreateGroup setIsShowCreateGroup={setIsShowCreateGroup}/>}
                        {isShowProfile &&
                            <div className={styles.profileContainer}>
                                <Profile onCloseProfile={onCloseProfile} initials={initials}/>
                            </div>}
                        {!isShowCreateGroup && !isShowProfile &&
                            <div className={styles.sideBarInnerContainer}>
                                <div className={styles.navContainer}>
                                    <div onClick={onOpenProfile} className={styles.userInfoContainer}>
                                        <Avatar sx={{
                                            width: '2.5rem',
                                            height: '2.5rem',
                                            fontSize: '1rem',
                                            mr: '0.75rem'
                                        }}>
                                            {initials}
                                        </Avatar>
                                        <p>{auth.reqUser?.fullName}</p>
                                    </div>
                                    <div>
                                        <IconButton>
                                            <ChatIcon/>
                                        </IconButton>
                                        <IconButton>
                                            <MoreVertIcon onClick={onOpenMenu}/>
                                        </IconButton>
                                        <Menu
                                            id="basic-menu"
                                            anchorEl={anchor}
                                            open={open}
                                            onClose={onCloseMenu}
                                            MenuListProps={{'aria-labelledby': 'basic-button'}}>
                                            <MenuItem onClick={onOpenProfile}>Profile</MenuItem>
                                            <MenuItem onClick={onCreateGroup}>Create Group</MenuItem>
                                            <MenuItem onClick={onLogout}>Logout</MenuItem>
                                        </Menu>
                                    </div>
                                </div>
                                <div className={styles.searchContainer}>
                                    <TextField
                                        id='search'
                                        type='text'
                                        label='Search your chats ...'
                                        size='small'
                                        fullWidth
                                        value={query}
                                        onChange={onChangeQuery}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position='start'>
                                                    <SearchIcon/>
                                                </InputAdornment>
                                            ),
                                            endAdornment: getSearchEndAdornment(),
                                        }}
                                        InputLabelProps={{
                                            shrink: focused || query.length > 0,
                                            style: {marginLeft: focused || query.length > 0 ? 0 : 30}
                                        }}
                                        onFocus={() => setFocused(true)}
                                        onBlur={() => setFocused(false)}/>
                                </div>
                                <div className={styles.chatsContainer}>
                                    {query.length > 0 && chat.chats?.filter(x =>
                                        x.isGroup ? x.chatName.toLowerCase().includes(query) :
                                            x.users[0].id === auth.reqUser?.id ? x.users[1].fullName.toLowerCase().includes(query) :
                                                x.users[0].fullName.toLowerCase().includes(query))
                                        .map((chat: ChatDTO) => (
                                            <div key={chat.id}>
                                                <hr/>
                                                <ChatCard chat={chat}/>
                                            </div>
                                        ))}
                                    {query.length === 0 && chat.chats?.map((chat: ChatDTO) => (
                                        <div key={chat.id}>
                                            <hr/>
                                            <ChatCard chat={chat}/>
                                        </div>
                                    ))}
                                    {chat.chats?.length > 0 ? <hr/> : <div></div>}
                                </div>
                            </div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Homepage;