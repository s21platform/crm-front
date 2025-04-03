import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ApiRoutes } from '../lib/routes/api.routes';
import { Staff, StaffListResponse, StaffListParams } from '../types/staff';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import RoleSelect from './RoleSelect';

const PAGE_SIZE = 20;

export default function StaffList() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<StaffListParams>({
    page: 1,
    page_size: PAGE_SIZE,
    search_term: '',
    role_id: undefined
  });

  const fetchStaff = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get<StaffListResponse>(ApiRoutes.staff.list(), {
        params: filters
      });
      setStaff(response.data.staff);
      setTotalCount(response.data.total_count);
      setPageCount(response.data.page_count);
    } catch (err) {
      setError('Ошибка при загрузке списка сотрудников');
      console.error('Error fetching staff:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [filters]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      search_term: e.target.value,
      page: 1 // Сбрасываем страницу при поиске
    }));
  };

  const handleRoleFilter = (roleId: number | undefined) => {
    setFilters(prev => ({
      ...prev,
      role_id: roleId,
      page: 1 // Сбрасываем страницу при смене роли
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Сотрудники</h1>
          <p className="mt-2 text-sm text-gray-700">
            Список всех сотрудников с их ролями и правами доступа
          </p>
        </div>
      </div>
      
      <div className="mt-4 flex flex-col sm:flex-row gap-4 sm:items-center">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Поиск по логину"
            value={filters.search_term}
            onChange={handleSearch}
          />
        </div>
        <div className="w-full sm:w-48">
          <RoleSelect
            value={filters.role_id || 0}
            onChange={(roleId) => handleRoleFilter(roleId || undefined)}
            placeholder="Все роли"
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Логин
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Роль
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Права доступа
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Дата создания
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-sm text-gray-500">
                        Загрузка...
                      </td>
                    </tr>
                  ) : staff.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-sm text-gray-500">
                        Сотрудники не найдены
                      </td>
                    </tr>
                  ) : (
                    staff.map((person) => (
                      <tr key={person.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {person.login}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {person.role_name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {person.permissions.access?.join(', ') || '—'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(person.created_at * 1000).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {pageCount > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(Math.max(1, (filters.page || 1) - 1))}
              disabled={filters.page === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Назад
            </button>
            <button
              onClick={() => handlePageChange(Math.min(pageCount, (filters.page || 1) + 1))}
              disabled={filters.page === pageCount}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Вперед
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Показано <span className="font-medium">{staff.length}</span> из{' '}
                <span className="font-medium">{totalCount}</span> сотрудников
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                      page === filters.page
                        ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                    } ${page === 1 ? 'rounded-l-md' : ''} ${
                      page === pageCount ? 'rounded-r-md' : ''
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 