import React, { useState, useRef, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";

export type SelectOption = {
  label: string;
  value: string;
}

type SelectPropsType = {
  label: string;
  isRequired?: boolean;
  errorMessage?: string;
  multiple: true;
  value: SelectOption[];
  onChange: (value: SelectOption[]) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  styles?: {
    label?: string;
    show?: string;
    errorMessage?: string;
  };
} 

export const MultiSelect = ({
  label,
  isRequired,
  errorMessage = '',
  multiple,
  options,
  value,
  onChange,
  placeholder = "Select...",
  disabled = false,
  styles = {
    label: "mb-1 block text-sm font-medium text-gray-700",
    show: "block",
    errorMessage: "mt-1 text-sm text-red-600"
  }
}: SelectPropsType) => {
  const [selectedValues, setSelectedValues] = useState<string[]>(value.map(v => v.value));
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSelectedValues(value.map(v => v.value));
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredOptions = options.filter(
    (o) =>
      !selectedValues.includes(o.value) &&
      o.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (value: string) => {
    const newSelected = [...selectedValues, value];
    setSelectedValues(newSelected);
    onChange(options.filter(o => newSelected.includes(o.value)));
    setSearch("");
    setDropdownOpen(false);
    inputRef.current?.focus();
  }

  const handleRemove = (value: string) => {
    const newSelected = selectedValues.filter(v => v !== value);
    setSelectedValues(newSelected);
    onChange(options.filter(o => newSelected.includes(o.value)));
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedValues([]);
    onChange([]);
    setSearch("");
    inputRef.current?.focus();
  };

  return (
    <div className="mb-4 w-full" ref={wrapperRef}>
      <p className={`${errorMessage && styles.errorMessage} ${styles.label}`}>
        <span className="mb-1 mr-1">{label}</span>
        <span className={`${isRequired ? "text-red-600" : ""}`}>{isRequired ? "Required" : "Optional"}</span>
      </p>
      
      <div 
        className={`relative mt-1 min-h-[42px] w-full rounded-md border ${errorMessage ? 'border-red-500' : 'border-gray-300'} ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white cursor-text'} shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500`}
        onClick={() => !disabled && setDropdownOpen(true)}
      >
        <div className="flex flex-wrap items-center gap-2 p-2">
          {selectedValues.map((val) => {
            const option = options.find(o => o.value === val);
            return option ? (
              <span
                key={val}
                className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
              >
                {option.label}
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(val);
                    }}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    <X size={14} />
                  </button>
                )}
              </span>
            ) : null;
          })}
          
          {!disabled && (
            <>
              <input
                ref={inputRef}
                type="text"
                className="flex-1 min-w-[100px] border-none bg-transparent p-1 text-sm outline-none placeholder:text-gray-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={selectedValues.length === 0 ? placeholder : ''}
                onFocus={() => setDropdownOpen(true)}
              />
              <div className="flex items-center gap-1">
                {selectedValues.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                )}
                <ChevronDown 
                  size={16} 
                  className={`text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} 
                />
              </div>
            </>
          )}
        </div>

        {dropdownOpen && !disabled && (
          <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 text-base shadow-lg focus:outline-none sm:text-sm">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className="relative cursor-default select-none px-4 py-2 text-gray-900 hover:bg-blue-50"
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="relative cursor-default select-none px-4 py-2 text-gray-500">
                No options available
              </div>
            )}
          </div>
        )}
      </div>

      {errorMessage && (
        <p className={styles.errorMessage}>
          {errorMessage}
        </p>
      )}
    </div>
  );
};