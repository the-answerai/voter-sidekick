import { ChangeEvent } from "react";

interface DynamicChatSelectProps {
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
}

const toTitleCase = (str: string) => {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

const DynamicChatSelect = ({ onChange, options }: DynamicChatSelectProps) => {
  return (
    <select
      onChange={onChange}
      className="text-xl p-4 bg-background text-foreground border border-foreground rounded"
    >
      <option value="" disabled selected>
        Select a chatbot
      </option>{" "}
      {/* Default option */}
      {options.map((option) => (
        <option key={option} value={option}>
          {toTitleCase(option)}
        </option>
      ))}
    </select>
  );
};

export default DynamicChatSelect;
