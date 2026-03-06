export interface Participant {
  id: string;
  name: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidById: string; // ID of the participant who paid
  splitMethod: 'equal' | 'proportional';
  splitDetails: { participantId: string; share: number }[]; // For proportional, or equal share if 'equal'
  category: ExpenseCategory;
}

export type ExpenseCategory = 'Food' | 'Transport' | 'Accommodation' | 'Activities' | 'Other';

export interface PackingItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Balance {
  participantId: string;
  amount: number; // Positive if participant is owed, negative if participant owes
}

export interface WhoOwesWhom {
  from: string; // Participant ID
  to: string; // Participant ID
  amount: number;
}
