import React from 'react';
import { OptionRequestDetails } from '../types/optionHub';
import { formatDate } from '../utils/dateUtils';

interface OptionRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestDetails: OptionRequestDetails | null;
  isLoading: boolean;
}

const OptionRequestModal: React.FC<OptionRequestModalProps> = ({
  isOpen,
  onClose,
  requestDetails,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
            </div>
          ) : requestDetails ? (
            <div>
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {requestDetails.value}
                </h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  requestDetails.status === 'success' ? 'bg-green-100 text-green-800' :
                  requestDetails.status === 'error' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {requestDetails.status === 'success' ? 'Успешно' :
                   requestDetails.status === 'error' ? 'Ошибка' :
                   'В обработке'}
                </span>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Категория</h4>
                  <p className="mt-1 text-sm text-gray-900">{requestDetails.attribute_value}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">ID пользователя</h4>
                  <p className="mt-1 text-sm text-gray-900">{requestDetails.user_uuid}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Создано</h4>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(requestDetails.created_at)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Обновлено</h4>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(requestDetails.updated_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              Информация не найдена
            </div>
          )}

          <div className="mt-5 sm:mt-6">
            <button
              type="button"
              className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
              onClick={onClose}
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptionRequestModal; 