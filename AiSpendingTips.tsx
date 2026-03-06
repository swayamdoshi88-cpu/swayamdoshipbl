import React, { useState, useCallback } from 'react';
import { generateSpendingTip } from '../services/geminiService';
import { ExpenseCategory, Expense } from '../types';

interface AiSpendingTipsProps {
  totalBudget: number;
  spendingByCategory: Record<ExpenseCategory, number>;
  expenses: Expense[];
}

export const AiSpendingTips: React.FC<AiSpendingTipsProps> = ({
  totalBudget,
  spendingByCategory,
  expenses,
}) => {
  const [tip, setTip] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getSpendingTip = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setTip('');
    try {
      // Fix: Explicitly type 'sum' and 'val' as numbers to resolve 'Operator "+" cannot be applied to types "unknown" and "unknown".'
      const currentSpend = Object.values(spendingByCategory).reduce((sum: number, val: number) => sum + val, 0);
      const prompt = `
        You are a smart trip expense advisor.
        A group is on a trip with a total budget of $${totalBudget.toFixed(2)}.
        Their current total spending is $${currentSpend.toFixed(2)}.
        Spending breakdown by category:
        ${Object.entries(spendingByCategory)
          // Ensures 'amount' is treated as a number for .toFixed(2) in all environments,
          // as direct destructuring type inference may be inconsistent.
          .map(([category, amount]) => `- ${category}: $${(amount as number).toFixed(2)}`)
          .join('\n')}

        Based on this data, provide a concise, helpful spending tip.
        Focus on categories where spending is high relative to the total budget, or general advice if overall spending is high.
        If overall spending is low, encourage them to continue smart spending.
        Keep the tip to one or two sentences.
      `;

      const generatedTip = await generateSpendingTip(prompt);
      setTip(generatedTip);
    } catch (err: any) {
      console.error('Error generating spending tip:', err);
      setError('Failed to generate tip. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [totalBudget, spendingByCategory]); // Dependencies for useCallback

  return (
    <div>
      <button
        onClick={getSpendingTip}
        disabled={isLoading || expenses.length === 0}
        className="w-full px-6 py-3 bg-[#4A5568] text-white rounded-md hover:bg-[#2D3748] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Generating Tip...' : 'Get AI Spending Tip'}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {tip && (
        <div className="bg-blue-50 p-4 rounded-md mt-4 border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2">Your AI Tip:</h4>
          <p className="text-blue-700">{tip}</p>
        </div>
      )}

      {expenses.length === 0 && (
        <p className="text-gray-500 text-center mt-4">Add some expenses to get tips!</p>
      )}
    </div>
  );
};