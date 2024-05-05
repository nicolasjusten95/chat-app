import {UserDTO} from "../../redux/auth/AuthModel";
import {Avatar, IconButton} from "@mui/material";
import React from "react";
import {getInitialsFromName} from "../utils/Utils";
import styles from './GroupMember.module.scss';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface GroupMemberProps {
    member: UserDTO;
    onRemoveMember?: (member: UserDTO) => void;
    onAddMember?: (member: UserDTO) => void;
}

const GroupMember = (props: GroupMemberProps) => {

    const initials: string = getInitialsFromName(props.member.fullName);

    const onRemove = () => {
        if (props.onRemoveMember) {
            props.onRemoveMember(props.member);
        }
    };

    const onAdd = () => {
        if (props.onAddMember) {
            props.onAddMember(props.member);
        }
    };

    return (
        <div className={styles.groupMemberOuterContainer}>
            <div className={styles.groupMemberAvatarContainer}>
                <Avatar sx={{
                    width: '2.5rem',
                    height: '2.5rem',
                    fontSize: '1rem',
                    mr: '0.75rem'
                }}>
                    {initials}
                </Avatar>
                <p>{props.member.fullName}</p>
            </div>
            {props.onAddMember &&
                <IconButton onClick={onAdd}>
                    <AddIcon/>
                </IconButton>
            }
            {props.onRemoveMember &&
                <IconButton onClick={onRemove}>
                    <RemoveIcon/>
                </IconButton>
            }
        </div>
    );
};

export default GroupMember;