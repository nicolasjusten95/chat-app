import {ChatDTO} from "../../redux/chat/ChatModel";
import {UserDTO} from "../../redux/auth/AuthModel";

export const getInitialsFromName = (name: string): string => {
    const splitName: string[] = name.split(' ');
    return splitName.length > 1 ? `${splitName[0][0]}${splitName[1][0]}` : splitName[0][0];
};

export const transformDateToString = (date: Date): string => {
    const currentDate = new Date();

    if (date.getFullYear() !== currentDate.getFullYear()) {
        return date.getFullYear().toString();
    }

    if (date.getDate() !== currentDate.getDate()) {
        return getDateFormat(date);
    }

    return date.getHours() + ":" + date.getMinutes();
};

export const getChatName = (chat: ChatDTO, reqUser: UserDTO | null): string => {
    return chat.isGroup ? chat.chatName : chat.users[0].id === reqUser?.id ?
        chat.users[1].fullName : chat.users[0].fullName;
};

export const getDateFormat = (date: Date): string => {
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const month = date.getMonth() < 9 ? `0${(date.getMonth() + 1)}` : (date.getMonth() + 1);
    return day + '.' + month + '.' + (date.getFullYear());
};