import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export const formatDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), 'dd MMM yyyy HH:mm', { locale: ru });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Некорректная дата';
  }
}; 