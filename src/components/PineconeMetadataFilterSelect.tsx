import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Check } from "lucide-react";

interface PineconeMetadataFilterSelectProps {
  options?: Map<string, string>;
  filterKey: string;
  placeholder?: string;
  isNumeric?: boolean;
  isSlider?: boolean;
  min?: number;
  max?: number;
  isMulti?: boolean;
  updateFilter: (key: string, value: string | number | string[]) => void;
  removeFilter: (key: string, value: string) => void;
  selectedValues: string[];
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
  isMulti = false,
  updateFilter,
  removeFilter,
  selectedValues,
}) => {
  const handleChange = (value: string | string[]) => {
    if (isSlider) {
      updateFilter(filterKey, Number(value));
    } else if (Array.isArray(value)) {
      updateFilter(filterKey, value);
    } else {
      if (selectedValues.includes(value)) {
        const newValues = selectedValues.filter((v) => v !== value);
        updateFilter(filterKey, newValues);
      } else {
        updateFilter(filterKey, [...selectedValues, value]);
      }
    }
  };

  const handleRemove = (value: string) => {
    removeFilter(filterKey, value);
  };

  if (isSlider) {
    return (
      <div className="space-y-2">
        <Label htmlFor={filterKey}>Top K: {selectedValues[0] || min}</Label>
        <Slider
          id={filterKey}
          min={min}
          max={max}
          step={1}
          value={[Number(selectedValues[0] || min)]}
          onValueChange={(value) => handleChange(value[0].toString())}
        />
      </div>
    );
  }

  const selectedOptions = selectedValues.map((value) => [
    value,
    options?.get(value) || value,
  ]);
  const unselectedOptions = Array.from(options || []).filter(
    ([value]) => !selectedValues.includes(value)
  );

  return (
    <div className="space-y-2">
      <Select
        onValueChange={handleChange}
        value={selectedValues}
        multiple={isMulti}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-md">
          <SelectGroup>
            {selectedOptions.length > 0 && (
              <>
                <SelectLabel className="px-2 py-1.5 text-sm font-semibold text-gray-900 bg-gray-100">
                  Selected {filterKey}
                </SelectLabel>
                {selectedOptions.map(([value, label]) => (
                  <SelectItem
                    key={value}
                    value={value}
                    className="flex items-center px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center w-full">
                      <Check className="mr-2 h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span className="flex-grow">{label}</span>
                    </div>
                  </SelectItem>
                ))}
              </>
            )}
            {unselectedOptions.length > 0 && (
              <>
                <SelectLabel className="px-2 py-1.5 text-sm font-semibold text-gray-900 bg-gray-100">
                  {selectedOptions.length > 0
                    ? `Other ${filterKey}`
                    : filterKey}
                </SelectLabel>
                {unselectedOptions.map(([value, label]) => (
                  <SelectItem
                    key={value}
                    value={value}
                    className="flex items-center px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center w-full">
                      <div className="w-4 h-4 mr-2 flex-shrink-0" />{" "}
                      {/* Placeholder for alignment */}
                      <span className="flex-grow">{label}</span>
                    </div>
                  </SelectItem>
                ))}
              </>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedValues.map((value) => (
            <Badge
              key={value}
              variant="secondary"
              className="flex items-center"
            >
              {options?.get(value) || value}
              <X
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={() => handleRemove(value)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default PineconeMetadataFilterSelect;
