import {Avatar, IconButton, InputAdornment, TextField} from "@mui/material";
import {getChatName, getInitialsFromName} from "../utils/Utils";
import React, {useState} from "react";
import {ChatDTO} from "../../redux/chat/ChatModel";
import {UserDTO} from "../../redux/auth/AuthModel";
import styles from './MesaggePage.module.scss';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import {MessageDTO} from "../../redux/message/MessageModel";
import MessageCard from "../messageCard/MessageCard";
import SendIcon from '@mui/icons-material/Send';
import ClearIcon from "@mui/icons-material/Clear";

interface MessagePageProps {
    chat: ChatDTO;
    reqUser: UserDTO | null;
    messages: MessageDTO[];
    newMessage: string;
    setNewMessage: (newMessage: string) => void;
}

const MessagePage = (props: MessagePageProps) => {

    const [messageQuery, setMessageQuery] = useState<string>("");
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [isSearch, setIsSearch] = useState<boolean>(false);

    const onChangeNewMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setNewMessage(e.target.value);
    };

    const onChangeMessageQuery = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessageQuery(e.target.value.toLowerCase());
    };

    const onChangeSearch = () => {
        setIsSearch(!isSearch);
    };

    const onClearQuery = () => {
        setMessageQuery("");
        setIsSearch(false);
    };

    const getSearchEndAdornment = () => {
        return <InputAdornment position='end'>
                <IconButton onClick={onClearQuery}>
                    <ClearIcon/>
                </IconButton>
            </InputAdornment>
    };

    return (
        <div className={styles.outerMessagePageContainer}>

            {/*Message Page Header*/}
            <div className={styles.messagePageHeaderContainer}>
                <div className={styles.messagePageInnerHeaderContainer}>
                    <div className={styles.messagePageHeaderNameContainer}>
                        <Avatar sx={{
                            width: '2.5rem',
                            height: '2.5rem',
                            fontSize: '1rem',
                            mr: '0.75rem'
                        }}>
                            {getInitialsFromName(getChatName(props.chat, props.reqUser))}
                        </Avatar>
                        <p>{getChatName(props.chat, props.reqUser)}</p>
                    </div>
                    <div className={styles.messagePageHeaderNameContainer}>
                        {!isSearch &&
                            <IconButton onClick={onChangeSearch}>
                            <SearchIcon/>
                        </IconButton>}
                        {isSearch &&
                            <TextField
                            id='searchMessages'
                            type='text'
                            label='Search for messages ...'
                            size='small'
                            fullWidth
                            value={messageQuery}
                            onChange={onChangeMessageQuery}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                        <SearchIcon/>
                                    </InputAdornment>
                                ),
                                endAdornment: getSearchEndAdornment(),
                            }}
                            InputLabelProps={{
                                shrink: isFocused || messageQuery.length > 0,
                                style: {marginLeft: isFocused || messageQuery.length > 0 ? 0 : 30}
                            }}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}/>}
                        <IconButton>
                            <MoreVertIcon/>
                        </IconButton>
                    </div>
                </div>
            </div>

            {/*Message Page Content*/}
            <div className={styles.messageContentContainer}>
                <div className={styles.messageContentInnerContainer}>
                    {messageQuery.length > 0 &&
                        props.messages.filter(x => x.content.toLowerCase().includes(messageQuery))
                            .map((message) => <MessageCard message={message} reqUser={props.reqUser}/>)}
                    {messageQuery.length === 0 &&
                        props.messages.map((message) => <MessageCard message={message} reqUser={props.reqUser}/>)}
                </div>
            </div>

            {/*Message Page Footer*/}
            <div className={styles.footerContainer}>
                <div className={styles.innerFooterContainer}>
                    <TextField
                        id='newMessage'
                        type='text'
                        label='Enter new message ...'
                        size='small'
                        fullWidth
                        value={props.newMessage}
                        onChange={onChangeNewMessage}
                        sx={{backgroundColor: 'white'}}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position='end'>
                                    <IconButton>
                                        <SendIcon/>
                                    </IconButton>
                                </InputAdornment>),
                        }}/>
                </div>
            </div>
        </div>
    );
};

export default MessagePage;