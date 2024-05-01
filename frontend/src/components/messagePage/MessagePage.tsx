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

interface MessagePageProps {
    chat: ChatDTO;
    reqUser: UserDTO | null;
    messages: MessageDTO[];
    newMessage: string;
    setNewMessage: (newMessage: string) => void;
}

const MessagePage = (props: MessagePageProps) => {

    const onChangeNewMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setNewMessage(e.target.value);
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
                        <IconButton>
                            <SearchIcon/>
                        </IconButton>
                        <IconButton>
                            <MoreVertIcon/>
                        </IconButton>
                    </div>
                </div>
            </div>

            {/*Message Page Content*/}
            <div className={styles.messageContentContainer}>
                <div className={styles.messageContentInnerContainer}>
                    {props.messages.map((message) => <MessageCard message={message} reqUser={props.reqUser}/>)}
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