import React, { useState, useRef, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";

export type SelectOption1 = {
  label: string;
  value: string;
};

type SingleSelectProps = {
  label: string;
  isRequired?: boolean;
  errorMessage?: string;
  value: SelectOption1 | null;
  onChange: (value: SelectOption1 | null) => void;
  options: SelectOption1[];
  placeholder?: string;
  disabled?: boolean;
  styles?: {
    label?: string;
    show?: string;
    errorMessage?: string;
  };
};

export const SingleSelect = ({
  label,
  isRequired,
  errorMessage = '',
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
}: SingleSelectProps) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    (o) => o.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (selectedValue: string) => {
    const selectedOption = options.find(o => o.value === selectedValue) || null;
    onChange(selectedOption);
    setDropdownOpen(false);
    setSearch('');
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setSearch('');
    inputRef.current?.focus();
  };

  return (
    <div className="mb-4 w-full" ref={wrapperRef}>
      <label className={`${styles.label} ${disabled ? 'opacity-50' : ''}`}>
        {label}
        {isRequired && <span className="text-red-600 ml-1">*</span>}
      </label>
      
      <div 
        className={`relative min-h-[42px] w-full rounded-md border ${errorMessage ? 'border-red-500' : 'border-gray-300'} ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white cursor-text'} shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500`}
        onClick={() => !disabled && setDropdownOpen(true)}
      >
        <div className="flex items-center gap-2 p-2">
          {value ? (
            <span className="flex-1 truncate text-sm">
              {value.label}
            </span>
          ) : (
            <span className="flex-1 truncate text-sm text-gray-400">
              {placeholder}
            </span>
          )}
          
          {!disabled && (
            <div className="flex items-center gap-1">
              {value && (
                <button
                  type="button"
                  onClick={clearSelection}
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
          )}
        </div>

        {dropdownOpen && !disabled && (
          <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 text-base shadow-lg focus:outline-none sm:text-sm">
            {/* Search input for filtering */}
            <div className="sticky top-0 bg-white px-2 py-1">
              <input
                ref={inputRef}
                type="text"
                className="w-full rounded border border-gray-300 p-1 text-sm outline-none focus:border-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                autoFocus
              />
            </div>
            
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`relative cursor-default select-none px-4 py-2 text-gray-900 hover:bg-blue-50 ${
                    value?.value === option.value ? 'bg-blue-100' : ''
                  }`}
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="relative cursor-default select-none px-4 py-2 text-gray-500">
                No options found
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