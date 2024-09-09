import { isNonEmptyString } from "./isNonEmptyString";

export const updateFilter = (
  prevFilter: Record<string, string>,
  key: string,
  value: string
): Record<string, string> => {
  const updatedFilter = { ...prevFilter };
  if (typeof value === "number" || isNonEmptyString(value)) {
    updatedFilter[key] = value;
  } else {
    delete updatedFilter[key];
  }
  return updatedFilter;
};
