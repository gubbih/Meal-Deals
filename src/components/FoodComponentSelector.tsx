import React, { useMemo, useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { FoodComponent } from "../models/FoodComponent";

interface FoodComponentSelectorProps {
  foodComponents: FoodComponent[];
  selectedComponents: FoodComponent[];
  onSelectionChange: (components: FoodComponent[]) => void;
  placeholder?: string;
  isSearchable?: boolean;
  disabled?: boolean;
  maxSelections?: number;
}

const animatedComponents = makeAnimated();

const FoodComponentSelector: React.FC<FoodComponentSelectorProps> = ({
  foodComponents,
  selectedComponents,
  onSelectionChange,
  placeholder = "Select food components...",
  isSearchable = true,
  disabled = false,
  maxSelections,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Transform food components for Select component display
  const foodComponentOptions = useMemo(() => {
    return foodComponents.map((component) => ({
      value: component.id.toString(),
      label: `${component.category.categoryName}: ${component.componentName}`,
      component: component,
    }));
  }, [foodComponents]);

  // Convert the current selection to the format expected by Select
  const selectedOptions = useMemo(() => {
    return selectedComponents.map((component) => ({
      value: component.id.toString(),
      label: `${component.category.categoryName}: ${component.componentName}`,
      component: component,
    }));
  }, [selectedComponents]);

  // Group options by category for better display
  const groupedOptions = useMemo(() => {
    const groups: { [key: string]: any[] } = {};

    // Filter options based on search term if provided
    const filteredOptions = searchTerm
      ? foodComponentOptions.filter(
          (option) =>
            option.component.componentName
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            option.component.category.categoryName
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            option.component.normalizedName
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase())
        )
      : foodComponentOptions;

    filteredOptions.forEach((option) => {
      const categoryName = option.component.category.categoryName;
      if (!groups[categoryName]) {
        groups[categoryName] = [];
      }
      groups[categoryName].push(option);
    });

    return Object.entries(groups)
      .map(([label, options]) => ({
        label,
        options: options.sort((a, b) =>
          a.component.componentName.localeCompare(b.component.componentName)
        ),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [foodComponentOptions, searchTerm]);

  // Handle selection change
  const handleSelectionChange = (selectedOptions: any) => {
    const selectedComponents = selectedOptions
      ? selectedOptions.map((option: any) => option.component)
      : [];

    onSelectionChange(selectedComponents);
  };

  // Custom filter function to enable search across component names and categories
  const customFilter = (option: any, searchText: string) => {
    if (!searchText) return true;

    const component = option.data.component;
    const searchLower = searchText.toLowerCase();

    return (
      component.componentName.toLowerCase().includes(searchLower) ||
      component.category.categoryName.toLowerCase().includes(searchLower) ||
      component.normalizedName?.toLowerCase().includes(searchLower) ||
      false
    );
  };

  // Group food components by category for display
  const groupedSelectedComponents = useMemo(() => {
    return selectedComponents.reduce(
      (acc, component) => {
        const categoryName = component.category.categoryName;
        if (!acc[categoryName]) acc[categoryName] = [];
        acc[categoryName].push(component);
        return acc;
      },
      {} as { [key: string]: FoodComponent[] }
    );
  }, [selectedComponents]);

  const isMaxReached = maxSelections
    ? selectedComponents.length >= maxSelections
    : false;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Select
          className="react-select-container"
          classNamePrefix="react-select"
          closeMenuOnSelect={false}
          components={animatedComponents}
          options={groupedOptions}
          isMulti
          value={selectedOptions}
          onChange={handleSelectionChange}
          placeholder={placeholder}
          noOptionsMessage={({ inputValue }) =>
            inputValue
              ? `No components found matching "${inputValue}"`
              : "No components available"
          }
          isSearchable={isSearchable}
          isDisabled={disabled || isMaxReached}
          filterOption={customFilter}
          menuPortalTarget={document.body}
          menuPosition="fixed"
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            menu: (base) => ({
              ...base,
              backgroundColor:
                "var(--tw-bg-opacity, 1) rgb(55 65 81 / var(--tw-bg-opacity))",
            }),
            menuList: (base) => ({
              ...base,
              backgroundColor: "transparent",
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isSelected
                ? "rgb(75 85 99)"
                : state.isFocused
                  ? "rgb(55 65 81)"
                  : "transparent",
              color: "rgb(229 231 235)",
              "&:hover": {
                backgroundColor: "rgb(75 85 99)",
              },
            }),
            group: (base) => ({
              ...base,
              paddingTop: 8,
              paddingBottom: 8,
            }),
            groupHeading: (base) => ({
              ...base,
              fontSize: 12,
              fontWeight: 600,
              color: "rgb(156 163 175)",
              textTransform: "uppercase" as const,
              letterSpacing: 0.5,
              marginBottom: 4,
            }),
          }}
          formatOptionLabel={(option) => (
            <div className="flex items-center justify-between w-full">
              <div>
                <div className="font-medium">
                  {option.component.componentName}
                </div>
                <div className="text-xs text-gray-400">
                  {option.component.category.categoryName}
                </div>
              </div>
            </div>
          )}
        />

        {isMaxReached && (
          <div className="mt-1 text-sm text-amber-600 dark:text-amber-400">
            Maximum of {maxSelections} components allowed
          </div>
        )}
      </div>

      {/* Display selected components grouped by category */}
      {selectedComponents.length > 0 && (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center justify-between">
            <span>Selected Components ({selectedComponents.length})</span>
            {maxSelections && (
              <span className="text-xs text-gray-500">
                {selectedComponents.length} / {maxSelections}
              </span>
            )}
          </h4>
          <div className="space-y-3">
            {Object.entries(groupedSelectedComponents).map(
              ([categoryName, components]) => (
                <div key={categoryName}>
                  <h5 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">
                    {categoryName} ({components.length})
                  </h5>
                  <div className="flex flex-wrap gap-1">
                    {components.map((component) => (
                      <span
                        key={component.id}
                        className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full"
                      >
                        {component.componentName}
                        <button
                          type="button"
                          onClick={() => {
                            const updatedComponents = selectedComponents.filter(
                              (c) => c.id !== component.id
                            );
                            onSelectionChange(updatedComponents);
                          }}
                          className="ml-1 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Quick category stats */}
      {selectedComponents.length > 0 && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Categories selected: {Object.keys(groupedSelectedComponents).length}
        </div>
      )}
    </div>
  );
};

export default FoodComponentSelector;
