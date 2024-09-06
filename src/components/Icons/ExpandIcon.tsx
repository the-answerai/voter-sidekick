import React from "react";

interface ExpandIconProps {
  isExpanded: boolean;
}

const ExpandIcon: React.FC<ExpandIconProps> = ({ isExpanded }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-4 w-4 inline-block ml-2 transition-transform ${isExpanded ? "rotate-180" : ""}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

export default ExpandIcon;
