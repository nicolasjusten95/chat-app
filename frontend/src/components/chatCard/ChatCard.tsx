import {Avatar, Badge} from "@mui/material";
import React from "react";
import {getChatName, getInitialsFromName, transformDateToString} from "../utils/Utils";
import styles from './ChatCard.module.scss';
import {ChatDTO} from "../../redux/chat/ChatModel";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/Store";
import {MessageDTO} from "../../redux/message/MessageModel";

interface ChatCardProps {
    chat: ChatDTO;
}

const ChatCard = (props: ChatCardProps) => {

    const {auth} = useSelector((state: RootState) => state);

    const name: string = getChatName(props.chat, auth.reqUser);
    const initials: string = getInitialsFromName(name);
    const sortedMessages: MessageDTO[] = props.chat.messages.sort((a, b) => +new Date(a.timeStamp) - +new Date(b.timeStamp));
    const lastMessage: MessageDTO | undefined = sortedMessages.length > 0 ? sortedMessages[sortedMessages.length - 1] : undefined;
    const lastMessageContent: string = lastMessage ? lastMessage.content.length > 25 ? lastMessage.content.slice(0, 25) + "..." : lastMessage.content : "";
    const lastMessageName: string = lastMessage ? lastMessage.user.fullName === auth.reqUser?.fullName ? "You" : lastMessage.user.fullName : "";
    const lastMessageString: string = lastMessage ? lastMessageName + ": " + lastMessageContent : "";
    const lastDate: string = lastMessage ? transformDateToString(new Date(lastMessage.timeStamp)) : "";
    const numberOfReadMessages: number = props.chat.messages.filter(msg =>
        msg.user.id === auth.reqUser?.id || msg.readBy.includes(auth.reqUser!.id)).length;
    const numberOfUnreadMessages: number = props.chat.messages.length - numberOfReadMessages;

    return (
        <div className={styles.chatCardOuterContainer}>
            <div className={styles.chatCardAvatarContainer}>
                <Avatar sx={{
                    width: '2.5rem',
                    height: '2.5rem',
                    fontSize: '1rem',
                    mr: '0.75rem'
                }}>
                    {initials}
                </Avatar>
            </div>
            <div className={styles.chatCardContentContainer}>
                <div className={styles.chatCardContentInnerContainer}>
                    <p className={styles.chatCardLargeTextContainer}>{name}</p>
                    <p className={styles.chatCardSmallTextContainer}>{lastDate}</p>
                </div>
                <div className={styles.chatCardContentInnerContainer}>
                    <p className={styles.chatCardSmallTextContainer}>{lastMessageString}</p>
                    {<Badge badgeContent={numberOfUnreadMessages} color='primary' sx={{mr: '0.75rem'}}/>}
                </div>
            </div>
        </div>
    );
};

export default ChatCard;