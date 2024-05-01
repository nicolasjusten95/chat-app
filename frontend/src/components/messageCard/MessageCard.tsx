import {MessageDTO} from "../../redux/message/MessageModel";
import {UserDTO} from "../../redux/auth/AuthModel";
import styles from './MessageCard.module.scss';
import {Chip} from "@mui/material";
import React from "react";

interface MessageCardProps {
    message: MessageDTO;
    reqUser: UserDTO | null;
}

const MessageCard = (props: MessageCardProps) => {

    const isOwnMessage = props.message.user.id === props.reqUser?.id;
    const date: Date = new Date(props.message.timeStamp);
    const hours = date.getHours() > 9 ? date.getHours().toString() : "0" + date.getHours();
    const minutes = date.getMinutes() > 9 ? date.getMinutes().toString() : "0" + date.getMinutes();
    const label: React.ReactElement = <div className={styles.bubbleContainer}>
        <p className={styles.contentContainer}>{props.message.content}</p>
        <p className={styles.timeContainer}>{hours + ":" + minutes}</p>
    </div>

    return (
        <div className={isOwnMessage ? styles.ownMessage : styles.othersMessage} key={props.message.id}>
            <Chip label={label}
                  sx={{height: 'auto', width: 'auto', backgroundColor: isOwnMessage ? '#d3fdd3' : 'white'}}/>
        </div>
    );
};

export default MessageCard;