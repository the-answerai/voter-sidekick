export const formatDate = (dateString: string | undefined | null): string => {
  if (!dateString) {
    return "Invalid Date";
  }

  const cleanDateString = dateString.startsWith("D:")
    ? dateString.slice(2)
    : dateString;
  const date = new Date(cleanDateString);
  return isNaN(date.getTime())
    ? "Invalid Date"
    : date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
      });
};

// Add a comment explaining the function's behavior
/**
 * Formats a date string into a localized string representation.
 * @param dateString - The input date string, which may start with "D:". Can be undefined or null.
 * @returns A formatted date string or "Invalid Date" if the input is invalid.
 */
