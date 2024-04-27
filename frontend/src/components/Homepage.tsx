import styles from './Homepage.module.scss';
import {Dispatch, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../redux/Store";
import {AuthReducerState} from "../redux/auth/Model";
import {TOKEN} from "../config/Config";
import CreateGroup from "./group/CreateGroup";
import Profile from "./profile/Profile";
import {Avatar, IconButton, Menu, MenuItem} from "@mui/material";
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {currentUser, logoutUser} from "../redux/auth/Action";

const Homepage = () => {

    const [isShowCreateGroup, setIsShowCreateGroup] = useState<boolean>(false);
    const [isShowProfile, setIsShowProfile] = useState<boolean>(false);
    const [anchor, setAnchor] = useState(null);
    const [initials, setInitials] = useState<string>("")
    const open = Boolean(anchor);
    const navigate = useNavigate();
    const dispatch: Dispatch<any> = useDispatch();
    const state: RootState = useSelector((state: AuthReducerState) => state);
    const token: string | null = localStorage.getItem(TOKEN);

    // TODO: Navigate to signin if no valid token
    useEffect(() => {
        if (token && !state.reqUser) {
            dispatch(currentUser(token));
        }
    }, [token, dispatch, state.reqUser]);

    // TODO: Test with name with only 1 initial
    useEffect(() => {
        if (state.reqUser && state.reqUser.fullName) {
            const letters = `${state.reqUser.fullName.split(' ')[0][0]}${state.reqUser.fullName.split(' ')[1][0]}`;
            setInitials(letters);
        }
    }, [state.reqUser]);

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

    const onLogout = () => {
      dispatch(logoutUser());
      navigate("/signin");
    };

    return (
        <div>
            <div className={styles.outerContainer}>
                <div className={styles.upperContainer}></div>
                <div className={styles.lowerContainer}>
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
                                        <p>{state.reqUser?.fullName}</p>
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
                                            <MenuItem>Create Group</MenuItem>
                                            <MenuItem onClick={onLogout}>Logout</MenuItem>
                                        </Menu>
                                    </div>
                                </div>
                            </div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Homepage;