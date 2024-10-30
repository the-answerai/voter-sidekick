export const uncamelCaseAndTitleCase = (str: string): string => {
    return str
        .replace(/.*\./, "") // Remove everything before the last period
        .replace(/([a-z])([A-Z])/g, "$1 $2") // Insert space between camel case words
        .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
};
