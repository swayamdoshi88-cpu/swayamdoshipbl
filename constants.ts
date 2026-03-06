import { Participant, ExpenseCategory } from './types';

export const TEAM_MEMBERS: Participant[] = [
  { id: 'rushikesh-gadekar', name: 'Rushikesh Gadekar' },
  { id: 'swayam-doshi', name: 'Swayam Doshi' },
  { id: 'sony-suthar', name: 'Sony Suthar' },
  { id: 'anusha-shete', name: 'Anusha Shete' },
  { id: 'soham-kango', name: 'Soham Kango' },
  { id: 'vivek-gaikwad', name: 'Vivek Gaikwad' },
];

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Transport',
  'Accommodation',
  'Activities',
  'Other',
];

export const DEFAULT_CURRENCY = 'USD'; // For the currency converter placeholder
export const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'JPY'];
export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  JPY: '¥',
};

// Placeholder exchange rates for demonstration
export const EXCHANGE_RATES: Record<string, Record<string, number>> = {
  USD: {
    EUR: 0.92,
    GBP: 0.79,
    INR: 83.3,
    JPY: 154.6,
  },
  EUR: {
    USD: 1.09,
    GBP: 0.86,
    INR: 90.7,
    JPY: 168.4,
  },
  GBP: {
    USD: 1.27,
    EUR: 1.16,
    INR: 105.2,
    JPY: 195.3,
  },
  INR: {
    USD: 0.012,
    EUR: 0.011,
    GBP: 0.0095,
    JPY: 1.85,
  },
  JPY: {
    USD: 0.0065,
    EUR: 0.0059,
    GBP: 0.0051,
    INR: 0.54,
  },
};
