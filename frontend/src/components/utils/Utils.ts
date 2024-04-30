export const getInitialsFromName = (name: string): string => {
    const splitName: string[] = name.split(' ');
    return splitName.length > 1 ? `${splitName[0][0]}${splitName[1][0]}` : splitName[0][0];
};