import React, { useState, useRef, useEffect } from 'react';

interface OptionNode {
  option_id: number;
  option_value: string;
  children?: OptionNode[];
}

interface FlatOption {
  id: number;
  value: string;
  level: number;
}

interface CustomSelectProps {
  treeData: OptionNode[];
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
}

const flattenTree = (tree: OptionNode[], level: number = 0): FlatOption[] => {
  return tree.reduce<FlatOption[]>((acc, node) => {
    acc.push({
      id: node.option_id,
      value: node.option_value,
      level
    });

    if (node.children && node.children.length > 0) {
      acc.push(...flattenTree(node.children, level + 1));
    }

    return acc;
  }, []);
};

const CustomSelect: React.FC<CustomSelectProps> = ({
  treeData,
  value,
  onChange,
  placeholder = 'Выберите значение'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const options = flattenTree(treeData);
  const selectedOption = options.find(opt => opt.id === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Фокус на поле поиска при открытии
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const filteredOptions = options.filter(option =>
    option.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleSelect = (optionId: number) => {
    onChange(optionId);
    setIsOpen(false);
    setSearchTerm('');
  };

  const renderOption = (option: FlatOption) => {
    const isSelected = option.id === value;
    const paddingLeft = option.level * 20;

    return (
      <div
        key={option.id}
        className={`px-4 py-2 cursor-pointer hover:bg-indigo-50 ${
          isSelected ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
        }`}
        style={{ 
          paddingLeft: `calc(1rem + ${paddingLeft}px)`,
          position: 'relative'
        }}
        onClick={() => handleSelect(option.id)}
      >
        {option.level > 0 && (
          <span 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-400"
            style={{ 
              marginLeft: `${paddingLeft - 4}px`
            }}
          >
            ·
          </span>
        )}
        {option.value}
      </div>
    );
  };

  return (
    <div className="relative" ref={selectRef}>
      <div
        className="border border-gray-300 rounded-md px-4 py-2 bg-white cursor-pointer flex justify-between items-center hover:border-indigo-500"
        onClick={handleOpen}
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
          {selectedOption ? selectedOption.value : placeholder}
        </span>
        <svg
          className={`h-5 w-5 text-gray-400 transform transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                className="w-full pl-9 pr-3 py-2 border-0 bg-gray-50 text-gray-900 placeholder:text-gray-400 sm:text-sm focus:ring-0"
                placeholder="Поиск..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          <div className="max-h-60 overflow-auto py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(renderOption)
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500 text-center">
                Ничего не найдено
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect; 