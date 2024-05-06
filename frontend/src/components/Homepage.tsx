import styles from './Homepage.module.scss';
import React, {useEffect, useState} from "react";
import {NavigateFunction, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../redux/Store";
import {TOKEN} from "../config/Config";
import EditGroupChat from "./editChat/EditGroupChat";
import Profile from "./profile/Profile";
import {Avatar, Divider, IconButton, InputAdornment, Menu, MenuItem, TextField} from "@mui/material";
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {currentUser, logoutUser} from "../redux/auth/AuthAction";
import SearchIcon from '@mui/icons-material/Search';
import {getUserChats, markChatAsRead} from "../redux/chat/ChatAction";
import {ChatDTO} from "../redux/chat/ChatModel";
import ChatCard from "./chatCard/ChatCard";
import {getInitialsFromName} from "./utils/Utils";
import ClearIcon from '@mui/icons-material/Clear';
import WelcomePage from "./welcomePage/WelcomePage";
import MessagePage from "./messagePage/MessagePage";
import {MessageDTO, WebSocketMessageDTO} from "../redux/message/MessageModel";
import {createMessage, getAllMessages} from "../redux/message/MessageAction";
import SockJS from 'sockjs-client';
import {Client, over, Subscription} from "stompjs";
import {AUTHORIZATION_PREFIX} from "../redux/Constants";
import CreateGroupChat from "./editChat/CreateGroupChat";
import CreateSingleChat from "./editChat/CreateSingleChat";

const Homepage = () => {

    const [isShowEditGroupChat, setIsShowEditGroupChat] = useState<boolean>(false);
    const [isShowCreateGroupChat, setIsShowCreateGroupChat] = useState<boolean>(false);
    const [isShowCreateSingleChat, setIsShowCreateSingleChat] = useState<boolean>(false);
    const [isShowProfile, setIsShowProfile] = useState<boolean>(false);
    const [anchor, setAnchor] = useState(null);
    const [initials, setInitials] = useState<string>("");
    const [query, setQuery] = useState<string>("");
    const [focused, setFocused] = useState<boolean>(false);
    const [currentChat, setCurrentChat] = useState<ChatDTO | null>(null);
    const [messages, setMessages] = useState<MessageDTO[]>([]);
    const [newMessage, setNewMessage] = useState<string>("");
    const [stompClient, setStompClient] = useState<Client | undefined>();
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [messageReceived, setMessageReceived] = useState<boolean>(false);
    const open = Boolean(anchor);
    const navigate: NavigateFunction = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const {auth, chat, message} = useSelector((state: RootState) => state);
    const token: string | null = localStorage.getItem(TOKEN);

    useEffect(() => {
        if (token && !auth.reqUser) {
            dispatch(currentUser(token));
        }
    }, [token, dispatch, auth.reqUser, navigate]);

    useEffect(() => {
        if (!token || auth.reqUser === null) {
            navigate("/signin");
        }
    }, [token, navigate, auth.reqUser]);

    useEffect(() => {
        if (auth.reqUser && auth.reqUser.fullName) {
            const letters = getInitialsFromName(auth.reqUser.fullName);
            setInitials(letters);
        }
    }, [auth.reqUser?.fullName]);

    useEffect(() => {
        if (token) {
            dispatch(getUserChats(token));
        }
    }, [chat.createdChat, chat.createdGroup, dispatch, token, message.newMessage, chat.deletedChat, chat.editedGroup, chat.markedAsReadChat]);

    useEffect(() => {
        setCurrentChat(chat.editedGroup);
    }, [chat.editedGroup]);

    useEffect(() => {
        if (currentChat?.id && token) {
            dispatch(getAllMessages(currentChat.id, token));
        }
    }, [currentChat, dispatch, token, message.newMessage]);

    useEffect(() => {
        setMessages(message.messages);
    }, [message.messages]);

    useEffect(() => {
        if (message.newMessage && stompClient && currentChat && isConnected) {
            const webSocketMessage: WebSocketMessageDTO = {...message.newMessage, chat: currentChat};
            stompClient.send("/app/messages", {}, JSON.stringify(webSocketMessage));
        }
    }, [message.newMessage]);

    useEffect(() => {
        if (isConnected && stompClient && stompClient.connected && auth.reqUser) {
            console.log("Connected to ws: ", isConnected);
            const subscription: Subscription = stompClient.subscribe("/topic/" + auth.reqUser.id.toString(), onMessageReceive);

            return () => {
                subscription.unsubscribe();
            };
        }
    }, [isConnected, stompClient, auth.reqUser]);

    useEffect(() => {
        if (messageReceived && currentChat?.id && token) {
            dispatch(markChatAsRead(currentChat.id, token));
            dispatch(getAllMessages(currentChat.id, token));
            dispatch(getUserChats(token));
        }
        setMessageReceived(false);
    }, [messageReceived]);

    useEffect(() => {
        connect();
    }, []);

    const connect = () => {

        const headers = {
            Authorization: `${AUTHORIZATION_PREFIX}${token}`
        };

        const socket: WebSocket = new SockJS("http://localhost:8080/ws");
        const client: Client = over(socket);
        setStompClient(client);
        client.connect(headers, onConnect, onError);
    };

    const onConnect = () => {
        setIsConnected(true);
    };

    const onError = (error: any) => {
        console.error("WebSocket connection error", error);
    };

    const onMessageReceive = () => {
        setMessageReceived(true);
    };

    const onSendMessage = () => {
        if (currentChat?.id && token) {
            dispatch(createMessage({chatId: currentChat.id, content: newMessage}, token));
            setNewMessage("");
        }
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

    const onCreateGroupChat = () => {
        onCloseMenu();
        setIsShowCreateGroupChat(true);
    };

    const onCreateSingleChat = () => {
        setIsShowCreateSingleChat(true);
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

    const onClickChat = (chat: ChatDTO) => {
        if (token) {
            dispatch(markChatAsRead(chat.id, token));
        }
        setCurrentChat(chat);
    };

    const getSearchEndAdornment = () => {
        return query.length > 0 &&
            <InputAdornment position='end'>
                <IconButton onClick={onClearQuery}>
                    <ClearIcon/>
                </IconButton>
            </InputAdornment>
    };

    return (
        <div>
            <div className={styles.outerContainer}>
                <div className={styles.innerContainer}>
                    <div className={styles.sideBarContainer}>
                        {isShowCreateSingleChat &&
                            <CreateSingleChat setIsShowCreateSingleChat={setIsShowCreateSingleChat} />}
                        {isShowCreateGroupChat &&
                            <CreateGroupChat setIsShowCreateGroupChat={setIsShowCreateGroupChat} />}
                        {isShowEditGroupChat && <EditGroupChat setIsShowEditGroupChat={setIsShowEditGroupChat} currentChat={currentChat} />}
                        {isShowProfile &&
                            <div className={styles.profileContainer}>
                                <Profile onCloseProfile={onCloseProfile} initials={initials}/>
                            </div>}
                        {!isShowCreateSingleChat && !isShowEditGroupChat && !isShowCreateGroupChat && !isShowProfile &&
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
                                        <IconButton onClick={onCreateSingleChat}>
                                            <ChatIcon/>
                                        </IconButton>
                                        <IconButton onClick={onOpenMenu}>
                                            <MoreVertIcon/>
                                        </IconButton>
                                        <Menu
                                            id="basic-menu"
                                            anchorEl={anchor}
                                            open={open}
                                            onClose={onCloseMenu}
                                            MenuListProps={{'aria-labelledby': 'basic-button'}}>
                                            <MenuItem onClick={onOpenProfile}>Profile</MenuItem>
                                            <MenuItem onClick={onCreateGroupChat}>Create Group</MenuItem>
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
                                            <div key={chat.id} onClick={() => onClickChat(chat)}>
                                                <Divider/>
                                                <ChatCard chat={chat}/>
                                            </div>
                                        ))}
                                    {query.length === 0 && chat.chats?.map((chat: ChatDTO) => (
                                        <div key={chat.id} onClick={() => onClickChat(chat)}>
                                            <Divider/>
                                            <ChatCard chat={chat}/>
                                        </div>
                                    ))}
                                    {chat.chats?.length > 0 ? <Divider/> : null}
                                </div>
                            </div>}
                    </div>
                    <div className={styles.messagesContainer}>
                        {!currentChat && <WelcomePage reqUser={auth.reqUser}/>}
                        {currentChat && <MessagePage
                            chat={currentChat}
                            reqUser={auth.reqUser}
                            messages={messages}
                            newMessage={newMessage}
                            setNewMessage={setNewMessage}
                            onSendMessage={onSendMessage}
                            setIsShowEditGroupChat={setIsShowEditGroupChat}
                            setCurrentChat={setCurrentChat}/>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Homepage;
