import React, { useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
  selectedValues: number | string | string[] | { $in: string[] };
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
  selectedValues,
}) => {
  return null;
  // const [localSelectedValues, setLocalSelectedValues] = React.useState<
  //   number | string | string[] | { $in: string[] }
  // >([]);

  // useEffect(() => {
  //   const valuesArray = Array.isArray(selectedValues)
  //     ? selectedValues
  //     : selectedValues &&
  //         typeof selectedValues === "object" &&
  //         "$in" in selectedValues
  //       ? selectedValues.$in
  //       : [selectedValues].filter(Boolean);
  //   setLocalSelectedValues(valuesArray);
  // }, [selectedValues]);

  // const handleCheckboxChange = (value: string, checked: boolean) => {
  //   let updatedValues = [...localSelectedValues];
  //   if (checked) {
  //     if (!updatedValues.includes(value)) {
  //       updatedValues.push(value);
  //     }
  //   } else {
  //     updatedValues = updatedValues.filter((v) => v !== value);
  //   }
  //   setLocalSelectedValues(updatedValues);
  //   updateFilter(filterKey, updatedValues);
  // };

  // const handleClearFilter = () => {
  //   setLocalSelectedValues([]);
  //   updateFilter(filterKey, []);
  // };

  // if (isSlider) {
  //   const sliderValue =
  //     typeof selectedValues === "number"
  //       ? selectedValues
  //       : Number(selectedValues) || min;

  //   return (
  //     <div className="space-y-2">
  //       <Label htmlFor={filterKey}>Top K: {sliderValue}</Label>
  //       <Slider
  //         id={filterKey}
  //         min={min}
  //         max={max}
  //         step={1}
  //         value={[sliderValue]}
  //         onValueChange={(value) => updateFilter(filterKey, value[0])}
  //       />
  //     </div>
  //   );
  // }

  // if (isMulti) {
  //   return (
  //     <div className="space-y-2">
  //       <Label>{placeholder || filterKey}</Label>
  //       <div className="flex flex-col max-h-64 overflow-y-auto">
  //         {Array.from(options || []).map(([value, label]) => (
  //           <div key={value} className="flex items-center">
  //             <Checkbox
  //               checked={localSelectedValues.includes(value)}
  //               onCheckedChange={(checked) =>
  //                 handleCheckboxChange(value, checked as boolean)
  //               }
  //               id={`${filterKey}-${value}`}
  //             />
  //             <Label htmlFor={`${filterKey}-${value}`} className="ml-2">
  //               {label}
  //             </Label>
  //           </div>
  //         ))}
  //       </div>
  //       {localSelectedValues.length > 0 && (
  //         <Button variant="secondary" onClick={handleClearFilter}>
  //           Clear {filterKey} Filter
  //         </Button>
  //       )}
  //     </div>
  //   );
  // }

  // // Single Select (if needed)
  // return (
  //   <div className="space-y-2">
  //     <Label>{placeholder || filterKey}</Label>
  //     <RadioGroup
  //       value={selectedValues as string}
  //       onValueChange={(value) => updateFilter(filterKey, value)}
  //     >
  //       {Array.from(options || []).map(([value, label]) => (
  //         <div key={value} className="flex items-center">
  //           <RadioGroupItem value={value} id={`${filterKey}-${value}`} />
  //           <Label htmlFor={`${filterKey}-${value}`} className="ml-2">
  //             {label}
  //           </Label>
  //         </div>
  //       ))}
  //     </RadioGroup>
  //   </div>
  // );
};

export default PineconeMetadataFilterSelect;
