import React, { useState, useEffect } from 'react';
import CustomSelect from './CustomSelect';

interface OptionSelectorProps {
  optionId: number;
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  className?: string;
}

interface OptionNode {
  option_id: number;
  option_value: string;
  children?: OptionNode[];
}

const OptionSelector: React.FC<OptionSelectorProps> = ({
  optionId,
  value,
  onChange,
  placeholder,
  className
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<OptionNode[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOptions = async () => {
      if (!optionId) return;

      setIsLoading(true);
      setError(null);

      try {
        // Закомментированный реальный API-запрос
        // const response = await fetch(`/api/option?option_id=${optionId}`);
        // if (!response.ok) {
        //   throw new Error('Failed to fetch options');
        // }
        // const data = await response.json();
        // setOptions(data.result || []);

        // Мок данных
        setOptions([
          {
            option_id: 7,
            option_value: 'Россия',
            children: [
              {
                option_id: 8,
                option_value: 'Москва и Московская область',
                children: [
                  { option_id: 9, option_value: 'Одинцово' },
                  { option_id: 10, option_value: 'Подольск' }
                ]
              },
              {
                option_id: 11,
                option_value: 'Санкт-Петербург и Ленинградская область',
                children: [
                  { option_id: 12, option_value: 'Кронштадт' }
                ]
              }
            ]
          }
        ]);

      } catch (err) {
        console.error('Error fetching options:', err);
        setError(err instanceof Error ? err.message : 'Ошибка загрузки опций');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOptions();
  }, [optionId]);

  if (error) {
    return (
      <div className="text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className={className}>
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin h-5 w-5 border-b-2 border-indigo-500"></div>
          <span className="text-sm text-gray-500">Загрузка опций...</span>
        </div>
      ) : (
        <CustomSelect
          treeData={options}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

export default OptionSelector; 