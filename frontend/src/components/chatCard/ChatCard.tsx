import {Avatar} from "@mui/material";
import React from "react";
import {getInitialsFromName} from "../utils/Utils";
import styles from './ChatCard.module.scss';

interface ChatCardProps {
    name: string,
}

const ChatCard = (props: ChatCardProps) => {
    return (
        <div className={styles.chatCardOuterContainer}>
            <div className={styles.chatCardAvatarContainer}>
                <Avatar sx={{
                    width: '2.5rem',
                    height: '2.5rem',
                    fontSize: '1rem',
                    mr: '0.75rem'
                }}>
                    {getInitialsFromName(props.name)}
                </Avatar>
            </div>
            <div className={styles.chatCardContentContainer}>
                <div className={styles.chatCardContentInnerContainer}>
                    <p className={styles.chatCardLargeTextContainer}>{props.name}</p>
                    <p className={styles.chatCardSmallTextContainer}>timestamp</p>
                </div>
                <div className={styles.chatCardContentInnerContainer}>
                    <p className={styles.chatCardSmallTextContainer}>first message ...</p>
                    <div>
                        <p className={styles.chatCardSmallTextContainer}>5</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatCard;