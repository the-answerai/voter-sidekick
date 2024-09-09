import React from "react";
import { useChatContext } from "../contexts/ChatContext";

interface PineconeMetadataFilterSelectProps {
  options?: Map<string, string>;
  filterKey: string;
  placeholder?: string;
  isNumeric?: boolean;
  isSlider?: boolean;
  min?: number;
  max?: number;
}

const PineconeMetadataFilterSelect: React.FC<
  PineconeMetadataFilterSelectProps
> = ({
  options,
  filterKey,
  placeholder,
  isNumeric = false,
  isSlider = false,
  min = 4,
  max = 30,
}) => {
  const { chatProps, updateMetadataFilter, updateTopK } = useChatContext();
  const selectedValue =
    filterKey === "topK"
      ? (chatProps?.chatflowConfig as { topK?: number })?.topK || min
      : (
          chatProps?.chatflowConfig?.pineconeMetadataFilter as Record<
            string,
            string | number
          >
        )?.[filterKey] || "";

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (filterKey === "topK") {
      updateTopK(Number(value));
    } else {
      if (value === "") {
        updateMetadataFilter(filterKey, ""); // Use empty string instead of undefined
      } else {
        updateMetadataFilter(filterKey, isNumeric ? Number(value) : value);
      }
    }
  };

  if (isSlider) {
    return (
      <div>
        <input
          type="range"
          min={min}
          max={max}
          value={selectedValue || min}
          onChange={handleChange}
          className="slider"
        />
        <span>{selectedValue || min}</span>
      </div>
    );
  }

  return (
    <select
      onChange={handleChange}
      value={selectedValue.toString()}
      className="select-dropdown"
    >
      <option value="">{placeholder}</option>
      {options &&
        Array.from(options).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
    </select>
  );
};

export default PineconeMetadataFilterSelect;
