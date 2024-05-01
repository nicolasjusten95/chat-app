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
        return date.getDate() + '.' + (date.getMonth() + 1) + '.' + (date.getFullYear());
    }

    return date.getHours() + ":" + date.getMinutes();
};