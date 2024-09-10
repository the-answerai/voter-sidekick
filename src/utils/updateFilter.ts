import { isNonEmptyString } from "./isNonEmptyString";
import { PineconeMetadataFilter } from "../types";

export const updateFilter = (
  prevFilter: PineconeMetadataFilter,
  key: string,
  value: string | number | string[]
): PineconeMetadataFilter => {
  const updatedFilter = { ...prevFilter };

  if (value === "" || (Array.isArray(value) && value.length === 0)) {
    delete updatedFilter[key as keyof PineconeMetadataFilter];
  } else {
    updatedFilter[key as keyof PineconeMetadataFilter] = value;
  }

  return updatedFilter;
};
