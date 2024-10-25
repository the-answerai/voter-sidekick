export const formatText = (text: string) => {
    if (!text || typeof text !== "string") return text;
    return text.replace(/\\n/g, "\n").replace(/\\"/g, '"').trim();
};
