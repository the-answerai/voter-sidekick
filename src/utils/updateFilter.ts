import { type PineconeMetadataFilter } from "../types";

export const updateFilter = (
  prevFilter: PineconeMetadataFilter,
  key: string,
  value: string | number | { $in: string[] },
): PineconeMetadataFilter => {
  const updatedFilter: PineconeMetadataFilter = { ...prevFilter };
  debugger;
  if (key === "topK") {
    // Ensure topK is always a number and not null
    updatedFilter.topK = typeof value === "number"
      ? value
      : parseInt(value as string, 10);
    // If parsing fails, set a default value or remove the key
    if (isNaN(updatedFilter.topK)) {
      delete updatedFilter.topK;
    }
  } else if (typeof value === "object" && "$in" in value) {
    if (value.$in.length === 0) {
      delete updatedFilter[key as keyof PineconeMetadataFilter];
    } else {
      updatedFilter[key as keyof PineconeMetadataFilter] = value;
    }
  } else if (value === "") {
    delete updatedFilter[key as keyof PineconeMetadataFilter];
  } else {
    updatedFilter[key as keyof PineconeMetadataFilter] = value;
  }

  return updatedFilter;
};

export const removeFilter = (
  currentFilters: Record<string, { $in: string[] }>,
  key: string,
  value: string,
) => {
  const updatedFilters = { ...currentFilters };
  if (updatedFilters[key] && updatedFilters[key].$in) {
    updatedFilters[key].$in = updatedFilters[key].$in.filter((v) =>
      v !== value
    );
    if (updatedFilters[key].$in.length === 0) {
      delete updatedFilters[key];
    }
  }
  return updatedFilters;
};
