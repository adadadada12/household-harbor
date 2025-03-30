
import { addDays, differenceInDays, parse, format, isValid } from 'date-fns';
import { ExpirySeverity, Item } from '@/types';

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

export const calculateDaysUntilExpiry = (expireDate: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expiryDate = new Date(expireDate);
  expiryDate.setHours(0, 0, 0, 0);
  
  return differenceInDays(expiryDate, today);
};

export const getExpirySeverity = (daysUntilExpiry: number): ExpirySeverity => {
  if (daysUntilExpiry <= 1) return 'red';
  if (daysUntilExpiry <= 4) return 'orange';
  return 'green';
};

export const getExpiryText = (daysUntilExpiry: number): string => {
  if (daysUntilExpiry < 0) return `Expired ${Math.abs(daysUntilExpiry)} days ago`;
  if (daysUntilExpiry === 0) return 'Expires today';
  if (daysUntilExpiry === 1) return 'Expires tomorrow';
  return `Expires in ${daysUntilExpiry} days`;
};

export const calculateExpireDateFromDays = (daysUntilExpiry: number): string => {
  const date = addDays(new Date(), daysUntilExpiry);
  return format(date, 'yyyy-MM-dd');
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'MMM dd, yyyy');
};

export const isItemExpired = (item: Item): boolean => {
  return calculateDaysUntilExpiry(item.expireDate) < 0;
};

export const isItemExpiring = (item: Item): boolean => {
  const daysUntil = calculateDaysUntilExpiry(item.expireDate);
  return daysUntil >= 0 && daysUntil <= 4;
};

export const validateDateString = (dateString: string): boolean => {
  if (!dateString) return false;
  
  // Try to parse the date in yyyy-MM-dd format
  const parsedDate = parse(dateString, 'yyyy-MM-dd', new Date());
  return isValid(parsedDate);
};
