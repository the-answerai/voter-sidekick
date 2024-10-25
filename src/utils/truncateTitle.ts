export const truncateTitle = (
    title: string,
    maxLength: number = 75,
): string => {
    if (title.length <= maxLength) return title;
    return title.slice(0, maxLength) + "...";
};
