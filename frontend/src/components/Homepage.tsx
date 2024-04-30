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
    const state: RootState = useSelector((state: RootState) => state);
    const token: string | null = localStorage.getItem(TOKEN);

    // TODO: Navigate to signin if no valid token
    useEffect(() => {
        if (token && !state.auth.reqUser) {
            dispatch(currentUser(token));
        }
    }, [token, dispatch, state.auth.reqUser]);

    // TODO: Test with name with only 1 initial
    useEffect(() => {
        if (state.auth.reqUser && state.auth.reqUser.fullName) {
            const letters = getInitialsFromName(state.auth.reqUser.fullName);
            setInitials(letters);
        }
    }, [state.auth.reqUser]);

    const getInitialsFromName = (name: string): string => {
        return `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`;
    };

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

    // TODO: Add searching for chats
    const onChangeQuery = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setQuery(e.target.value);
    };

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
                                        <p>{state.auth.reqUser?.fullName}</p>
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
                                            )
                                        }}
                                        InputLabelProps={{
                                            shrink: focused || query.length > 0,
                                            style: {marginLeft: focused || query.length > 0 ? 0 : 30}
                                        }}
                                        onFocus={() => setFocused(true)}
                                        onBlur={() => setFocused(false)}/>
                                </div>
                                <div className={styles.chatsContainer}>
                                    Chats
                                </div>
                            </div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Homepage;