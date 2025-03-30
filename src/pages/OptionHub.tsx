import React, { useState, useEffect } from 'react';
import OptionRequestCard from '../components/OptionRequestCard';
import OptionRequestModal from '../components/OptionRequestModal';
import { OptionRequest, OptionRequestDetails, OptionRequestsResponse } from '../types/optionHub';
import { ApiRoutes } from '../lib/routes';
import axios from 'axios';

interface TabData {
  id: string;
  title: string;
  content: React.ReactNode;
}

const OptionHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAttribute, setSelectedAttribute] = useState<string>('Все');
  const [requests, setRequests] = useState<OptionRequest[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequestDetails, setSelectedRequestDetails] = useState<OptionRequestDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      console.log('Отправка запроса...');
      const response = await axios.get<OptionRequestsResponse>(ApiRoutes.optionRequests.list(), {
        withCredentials: true,
      });
      console.log('Ответ получен:', response.data);
      setRequests(response.data.option_requests_list);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Ошибка при загрузке заявок:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          method: error.config?.method,
          data: error.response?.data
        });
      } else {
        console.error('Неизвестная ошибка:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Получаем уникальные атрибуты для фильтра
  const uniqueAttributes = ['Все', ...Array.from(new Set(requests.map(request => request.attribute_value)))];

  // Обновляем функцию фильтрации
  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.attribute_value.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAttribute = selectedAttribute === 'Все' || request.attribute_value === selectedAttribute;
    return matchesSearch && matchesAttribute;
  });

  // Обновляем функцию получения деталей заявки
  const handleRequestClick = async (id: number) => {
    setIsModalOpen(true);
    setIsLoading(true);

    const request = requests.find(r => r.id === id);
    if (request) {
      const mockDetails: OptionRequestDetails = {
        ...request,
        status: 'success',
        updated_at: new Date().toISOString()
      };
      setSelectedRequestDetails(mockDetails);
    }
    setIsLoading(false);
  };

  const tabs: TabData[] = [
    {
      id: 'requests',
      title: 'Заявки',
      content: (
        <div className="space-y-4">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Поиск заявок..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {uniqueAttributes.map(attr => (
              <button
                key={attr}
                onClick={() => setSelectedAttribute(attr)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                  selectedAttribute === attr
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {attr === 'Все' ? 'Все категории' : attr}
              </button>
            ))}
          </div>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRequests.map((request) => (
                <OptionRequestCard
                  key={request.id}
                  request={request}
                  onClick={handleRequestClick}
                />
              ))}
            </div>
          )}
          {!isLoading && filteredRequests.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              Заявки не найдены
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'analytics',
      title: 'Аналитика',
      content: (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Статистика торговли</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded">
                <div className="text-lg font-medium text-green-700">Прибыльные сделки</div>
                <div className="text-2xl font-bold text-green-800">75%</div>
              </div>
              <div className="bg-red-50 p-4 rounded">
                <div className="text-lg font-medium text-red-700">Убыточные сделки</div>
                <div className="text-2xl font-bold text-red-800">25%</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'settings',
      title: 'Настройки',
      content: (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Настройки API</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">API Ключ</label>
                <input
                  type="password"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value="************************"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Тип подключения</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option>Реальный счет</option>
                  <option>Демо счет</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="py-6">
      <div className="mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">OptionHub</h1>
      </div>
      <div className="mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${
                      activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.title}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-4">
            {activeTab === 'requests' && (
              <div className="space-y-4">
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Поиск заявок..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {uniqueAttributes.map(attr => (
                    <button
                      key={attr}
                      onClick={() => setSelectedAttribute(attr)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                        selectedAttribute === attr
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {attr === 'Все' ? 'Все категории' : attr}
                    </button>
                  ))}
                </div>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredRequests.map((request) => (
                      <OptionRequestCard
                        key={request.id}
                        request={request}
                        onClick={handleRequestClick}
                      />
                    ))}
                  </div>
                )}
                {!isLoading && filteredRequests.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    Заявки не найдены
                  </div>
                )}
              </div>
            )}
            {activeTab === 'analytics' && (
              <div className="space-y-4">
                {/* Контент вкладки аналитики */}
              </div>
            )}
            {activeTab === 'settings' && (
              <div className="space-y-4">
                {/* Контент вкладки настроек */}
              </div>
            )}
          </div>
        </div>
      </div>

      <OptionRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        requestDetails={selectedRequestDetails}
        isLoading={isLoading}
      />
    </div>
  );
};

export default OptionHub; 