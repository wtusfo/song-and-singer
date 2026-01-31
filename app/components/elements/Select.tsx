"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  KeyboardEvent,
} from "react";

type SelectSize = "large" | "default" | "small";
type SelectKeyboardEvent = KeyboardEvent<HTMLButtonElement> | KeyboardEvent<HTMLInputElement>;

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  error?: string;
  size?: SelectSize;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  className?: string;
  name?: string;
  id?: string;
}

const sizeClasses: Record<SelectSize, string> = {
  large: "h-10 px-4 text-base",
  default: "h-8 px-3 text-sm",
  small: "h-7 px-3 text-sm",
};

const labelSizeClasses: Record<SelectSize, string> = {
  large: "text-base",
  default: "text-sm",
  small: "text-sm",
};

const dropdownSizeClasses: Record<SelectSize, string> = {
  large: "text-base",
  default: "text-sm",
  small: "text-sm",
};

const optionSizeClasses: Record<SelectSize, string> = {
  large: "px-3 py-1.5",
  default: "px-2.5 py-1",
  small: "px-2 py-1",
};

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const Select = ({
  label,
  error,
  size = "default",
  options,
  value,
  onChange,
  placeholder = "Select an option",
  searchable = false,
  className = "",
  name,
  id,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectId = id || name;

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = searchable
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  const handleSelect = useCallback(
    (optionValue: string) => {
      onChange?.(optionValue);
      setIsOpen(false);
      setSearchQuery("");
      setHighlightedIndex(0);
    },
    [onChange]
  );

  const handleKeyDown = (e: SelectKeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex].value);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setSearchQuery("");
        break;
    }
  };

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    if (isOpen && listRef.current) {
      const highlightedElement = listRef.current.children[
        searchable ? highlightedIndex + 1 : highlightedIndex
      ] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex, isOpen, searchable]);

  return (
    <div className="flex flex-col gap-1.5" ref={containerRef}>
      {label && (
        <label
          htmlFor={selectId}
          className={`font-medium text-navy dark:text-cream ${labelSizeClasses[size]}`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          id={selectId}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          className={`
            w-full rounded-lg border border-slate/30 bg-white
            text-left text-navy
            transition-colors cursor-pointer
            focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20
            dark:border-cream/30 dark:bg-navy/50 dark:text-cream
            dark:focus:border-gold dark:focus:ring-gold/20
            flex items-center justify-between gap-2
            ${sizeClasses[size]}
            ${error ? "border-red focus:border-red focus:ring-red/20" : ""}
            ${className}
          `}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={selectedOption ? "" : "text-slate/50 dark:text-cream/50"}>
            {selectedOption?.label || placeholder}
          </span>
          <ChevronIcon isOpen={isOpen} />
        </button>

        {isOpen && (
          <ul
            ref={listRef}
            role="listbox"
            className={`
              absolute z-50 mt-2 w-full rounded-xl border border-slate/10
              bg-white shadow-xl shadow-slate/10
              dark:border-cream/10 dark:bg-navy dark:shadow-black/20
              max-h-90 overflow-auto
              ${dropdownSizeClasses[size]}
            `}
          >
            {searchable && (
              <li className="sticky top-0 bg-white dark:bg-navy p-2 pb-1">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search..."
                  className={`
                    w-full rounded-lg border border-slate/20 bg-slate/5
                    text-navy placeholder:text-slate/40
                    focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/10
                    dark:border-cream/20 dark:bg-cream/5 dark:text-cream dark:placeholder:text-cream/40
                    dark:focus:border-gold dark:focus:ring-gold/10
                    ${size === "large" ? "px-2.5 py-1.5 text-base" : "px-2 py-1.5 text-sm"}
                  `}
                />
              </li>
            )}
            {filteredOptions.length === 0 ? (
              <li
                className={`text-slate/50 dark:text-cream/50 ${optionSizeClasses[size]}`}
              >
                No options found
              </li>
            ) : (
              filteredOptions.map((option, index) => (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={value === option.value}
                  onClick={() => handleSelect(option.value)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`
                    cursor-pointer transition-colors mx-1.5 my-0.5 rounded-lg
                    ${optionSizeClasses[size]}
                    ${
                      value === option.value
                        ? "bg-teal/10 text-teal dark:bg-gold/10 dark:text-gold font-medium"
                        : "text-navy dark:text-cream"
                    }
                    ${
                      highlightedIndex === index && value !== option.value
                        ? "bg-slate/5 dark:bg-cream/5"
                        : ""
                    }
                    ${index === 0 ? "mt-1.5" : ""}
                    ${index === filteredOptions.length - 1 ? "mb-1.5" : ""}
                    hover:bg-slate/5 dark:hover:bg-cream/5
                  `}
                >
                  {option.label}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
      {error && <p className="text-xs text-red">{error}</p>}
    </div>
  );
};

Select.displayName = "Select";

export { Select };
export type { SelectOption };
