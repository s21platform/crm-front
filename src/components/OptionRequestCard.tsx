import React from 'react';
import { OptionRequest } from '../types/optionHub';
import { formatDate } from '../utils/dateUtils';

interface OptionRequestCardProps {
  request: OptionRequest;
  onClick: (id: number) => void;
}

const OptionRequestCard: React.FC<OptionRequestCardProps> = ({ request, onClick }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
      onClick={() => onClick(request.id)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium text-gray-900">{request.value}</h3>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
          {request.attribute_value}
        </span>
      </div>
      <div className="text-sm text-gray-500">
        {formatDate(request.created_at)}
      </div>
    </div>
  );
};

export default OptionRequestCard; 