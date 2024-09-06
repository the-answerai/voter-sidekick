import React from "react";
import { useChatContext } from "../contexts/ChatContext";
// Remove this import if it exists:
// import { topics, locales } from "../chatbots/config/chatbotConfig";

interface PineconeMetadataFilterSelectProps {
  options: Map<string, string>;
  filterKey: string;
  placeholder: string;
}

const PineconeMetadataFilterSelect: React.FC<
  PineconeMetadataFilterSelectProps
> = ({ options, filterKey, placeholder }) => {
  const { chatProps, updateMetadataFilter } = useChatContext();
  const selectedValue =
    chatProps?.chatflowConfig?.pineconeMetadataFilter?.[filterKey] || "";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateMetadataFilter(filterKey, e.target.value);
  };

  return (
    <select
      onChange={handleChange}
      value={selectedValue}
      className="select-dropdown"
    >
      <option value="">{placeholder}</option>
      {Array.from(options).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
};

export default PineconeMetadataFilterSelect;
