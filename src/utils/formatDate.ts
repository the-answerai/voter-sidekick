export const formatDate = (dateString: string): string => {
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
