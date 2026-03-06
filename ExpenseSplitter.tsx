import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Participant, Expense, PackingItem, Balance, WhoOwesWhom, ExpenseCategory } from '../types';
import { EXPENSE_CATEGORIES, DEFAULT_CURRENCY, SUPPORTED_CURRENCIES, EXCHANGE_RATES, CURRENCY_SYMBOLS } from '../constants';
import { AiSpendingTips } from './AiSpendingTips';
import { v4 as uuidv4 } from 'uuid';

export const ExpenseSplitter: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newParticipantName, setNewParticipantName] = useState<string>('');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpense, setNewExpense] = useState<Omit<Expense, 'id' | 'splitMethod' | 'splitDetails'>>({
    description: '',
    amount: 0,
    paidById: '',
    category: 'Other',
  });
  const [selectedSplitParticipants, setSelectedSplitParticipants] = useState<string[]>([]);
  const [packingItems, setPackingItems] = useState<PackingItem[]>([]);
  const [newPackingItemText, setNewPackingItemText] = useState<string>('');
  const [baseCurrency, setBaseCurrency] = useState<string>(DEFAULT_CURRENCY);
  const [targetCurrency, setTargetCurrency] = useState<string>('EUR');
  const [amountToConvert, setAmountToConvert] = useState<number>(1);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  // New state for settlement link
  const [paymentLink, setPaymentLink] = useState<{ method: 'upi' | 'paypal'; link: string; transactionDescription: string } | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (amountToConvert > 0) {
      const rate = EXCHANGE_RATES[baseCurrency]?.[targetCurrency];
      if (rate !== undefined) {
        setConvertedAmount(amountToConvert * rate);
      } else {
        setConvertedAmount(null);
      }
    } else {
      setConvertedAmount(null);
    }
  }, [baseCurrency, targetCurrency, amountToConvert]);

  const addParticipant = useCallback(() => {
    if (newParticipantName.trim()) {
      setParticipants((prev) => [...prev, { id: uuidv4(), name: newParticipantName.trim() }]);
      setNewParticipantName('');
    }
  }, [newParticipantName]);

  const removeParticipant = useCallback((id: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
    setExpenses((prev) =>
      prev.filter((e) => e.paidById !== id && !e.splitDetails.some((sd) => sd.participantId === id)),
    );
  }, []);

  const addExpense = useCallback(() => {
    if (
      newExpense.description.trim() &&
      newExpense.amount > 0 &&
      newExpense.paidById &&
      selectedSplitParticipants.length > 0
    ) {
      const splitAmountPerPerson = newExpense.amount / selectedSplitParticipants.length;
      const splitDetails = selectedSplitParticipants.map((participantId) => ({
        participantId,
        share: splitAmountPerPerson,
      }));

      setExpenses((prev) => [
        ...prev,
        {
          ...newExpense,
          id: uuidv4(),
          splitMethod: 'equal', // For simplicity, always equal for now
          splitDetails,
        },
      ]);
      setNewExpense({ description: '', amount: 0, paidById: '', category: 'Other' });
      setSelectedSplitParticipants([]);
    }
  }, [newExpense, selectedSplitParticipants]);

  const removeExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const balances = useMemo(() => {
    const participantBalances: Record<string, number> = {};
    participants.forEach((p) => (participantBalances[p.id] = 0));

    expenses.forEach((expense) => {
      // Participant who paid
      participantBalances[expense.paidById] += expense.amount;

      // Participants who owe
      expense.splitDetails.forEach((detail) => {
        participantBalances[detail.participantId] -= detail.share;
      });
    });

    return Object.entries(participantBalances).map(([participantId, amount]) => ({
      participantId,
      amount,
    }));
  }, [participants, expenses]);

  const getWhoOwesWhom = useCallback((): WhoOwesWhom[] => {
    const netBalances = balances.reduce(
      (acc, curr) => {
        acc[curr.participantId] = curr.amount;
        return acc;
      },
      {} as Record<string, number>,
    );

    const debtors: { id: string; amount: number }[] = [];
    const creditors: { id: string; amount: number }[] = [];

    for (const participantId in netBalances) {
      if (netBalances[participantId] < 0) {
        debtors.push({ id: participantId, amount: Math.abs(netBalances[participantId]) });
      } else if (netBalances[participantId] > 0) {
        creditors.push({ id: participantId, amount: netBalances[participantId] });
      }
    }

    const transactions: WhoOwesWhom[] = [];
    let dIdx = 0;
    let cIdx = 0;

    while (dIdx < debtors.length && cIdx < creditors.length) {
      const debtor = debtors[dIdx];
      const creditor = creditors[cIdx];
      const amount = Math.min(debtor.amount, creditor.amount);

      transactions.push({ from: debtor.id, to: creditor.id, amount });

      debtor.amount -= amount;
      creditor.amount -= amount;

      if (debtor.amount === 0) {
        dIdx++;
      }
      if (creditor.amount === 0) {
        cIdx++;
      }
    }
    return transactions;
  }, [balances]);

  const whoOwesWhom = useMemo(() => getWhoOwesWhom(), [getWhoOwesWhom]);

  // Function to generate UPI/PayPal link
  const handleGeneratePaymentLink = useCallback(
    (method: 'upi' | 'paypal') => {
      setPaymentLink(null); // Clear previous link
      setCopyFeedback(null);

      if (whoOwesWhom.length === 0) {
        alert('No outstanding transactions to settle!');
        return;
      }

      const firstTxn = whoOwesWhom[0];
      const fromParticipant = participants.find((p) => p.id === firstTxn.from)?.name || 'Someone';
      const toParticipant = participants.find((p) => p.id === firstTxn.to)?.name || 'Someone';
      const amount = firstTxn.amount.toFixed(2);
      const transactionDescription = `${fromParticipant} owes ${toParticipant} $${amount}`;

      let link = '';
      if (method === 'upi') {
        // Simulated UPI deep link
        const recipientUpiId = `${toParticipant.replace(/\s/g, '').toLowerCase()}@examplebank`;
        link = `upi://pay?pa=${recipientUpiId}&pn=${encodeURIComponent(
          toParticipant,
        )}&am=${amount}&cu=USD`;
      } else if (method === 'paypal') {
        // Simulated PayPal.me link
        const paypalUsername = `${toParticipant.replace(/\s/g, '').toLowerCase()}user`;
        link = `https://paypal.me/${paypalUsername}/${amount}`;
      }
      setPaymentLink({ method, link, transactionDescription });
    },
    [whoOwesWhom, participants],
  );

  const handleCopyLink = useCallback(() => {
    if (paymentLink?.link) {
      navigator.clipboard.writeText(paymentLink.link).then(
        () => {
          setCopyFeedback('Link copied!');
          setTimeout(() => setCopyFeedback(null), 3000);
        },
        (err) => {
          console.error('Failed to copy text: ', err);
          setCopyFeedback('Failed to copy link.');
          setTimeout(() => setCopyFeedback(null), 3000);
        },
      );
    }
  }, [paymentLink]);

  const addPackingItem = useCallback(() => {
    if (newPackingItemText.trim()) {
      setPackingItems((prev) => [
        ...prev,
        { id: uuidv4(), text: newPackingItemText.trim(), completed: false },
      ]);
      setNewPackingItemText('');
    }
  }, [newPackingItemText]);

  const togglePackingItem = useCallback((id: string) => {
    setPackingItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)),
    );
  }, []);

  const removePackingItem = useCallback((id: string) => {
    setPackingItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const totalBudget = 1000; // Example total trip budget for AI tips
  const spendingByCategory = useMemo(() => {
    const categoryTotals: Record<ExpenseCategory, number> = {
      Food: 0,
      Transport: 0,
      Accommodation: 0,
      Activities: 0,
      Other: 0,
    };
    expenses.forEach((e) => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });
    return categoryTotals;
  }, [expenses]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 bg-gray-50 rounded-lg shadow-inner">
      {/* Participants & Expenses */}
      <div className="lg:col-span-2 space-y-8">
        {/* Participants Management */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-2xl font-bold text-[#3A4A3B] mb-4">Participants</h3>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
            <input
              type="text"
              placeholder="Participant Name"
              value={newParticipantName}
              onChange={(e) => setNewParticipantName(e.target.value)}
              className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B46C1]"
            />
            <button
              onClick={addParticipant}
              className="px-6 py-3 bg-[#6B46C1] text-white rounded-md hover:bg-[#553C9A] transition duration-300"
            >
              Add Participant
            </button>
          </div>
          <ul className="space-y-2">
            {participants.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-200"
              >
                <span className="text-lg text-[#1A202C]">{p.name}</span>
                <button
                  onClick={() => removeParticipant(p.id)}
                  className="p-2 text-red-600 hover:text-red-800 transition duration-300"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                </button>
              </li>
            ))}
          </ul>
          {participants.length === 0 && (
            <p className="text-gray-500 text-center mt-4">No participants added yet.</p>
          )}
        </div>

        {/* Add Expense Form */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-2xl font-bold text-[#3A4A3B] mb-4">Add Expense</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Description"
              value={newExpense.description}
              onChange={(e) => setNewExpense((prev) => ({ ...prev, description: e.target.value }))}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B46C1]"
            />
            <input
              type="number"
              placeholder="Amount"
              value={newExpense.amount > 0 ? newExpense.amount : ''}
              onChange={(e) =>
                setNewExpense((prev) => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))
              }
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B46C1]"
            />
            <select
              value={newExpense.paidById}
              onChange={(e) => setNewExpense((prev) => ({ ...prev, paidById: e.target.value }))}
              className="p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#6B46C1]"
            >
              <option value="">Paid by</option>
              {participants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <select
              value={newExpense.category}
              onChange={(e) =>
                setNewExpense((prev) => ({
                  ...prev,
                  category: e.target.value as ExpenseCategory,
                }))
              }
              className="p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#6B46C1]"
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Split among:</label>
            <div className="flex flex-wrap gap-2">
              {participants.map((p) => (
                <button
                  key={p.id}
                  onClick={() =>
                    setSelectedSplitParticipants((prev) =>
                      prev.includes(p.id) ? prev.filter((id) => id !== p.id) : [...prev, p.id],
                    )
                  }
                  className={`px-4 py-2 rounded-full border transition duration-300 ${
                    selectedSplitParticipants.includes(p.id)
                      ? 'bg-[#805AD5] text-white border-[#805AD5]'
                      : 'bg-white text-[#6B46C1] border-[#6B46C1] hover:bg-[#F6F0FF]'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={addExpense}
            disabled={
              !newExpense.description ||
              newExpense.amount <= 0 ||
              !newExpense.paidById ||
              selectedSplitParticipants.length === 0
            }
            className="w-full px-6 py-3 bg-[#6B46C1] text-white rounded-md hover:bg-[#553C9A] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Expense
          </button>
        </div>

        {/* Expense List */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-2xl font-bold text-[#3A4A3B] mb-4">Expenses</h3>
          <ul className="space-y-4">
            {expenses.map((e) => (
              <li
                key={e.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-200"
              >
                <div>
                  <p className="text-lg font-semibold text-[#1A202C]">{e.description}</p>
                  <p className="text-sm text-gray-600">
                    Paid by{' '}
                    <span className="font-medium text-[#4A5568]">
                      {participants.find((p) => p.id === e.paidById)?.name || 'Unknown'}
                    </span>{' '}
                    for <span className="font-medium text-[#4A5568]">${e.amount.toFixed(2)}</span> (
                    {e.category})
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Split among:{' '}
                    {e.splitDetails
                      .map(
                        (sd) =>
                          participants.find((p) => p.id === sd.participantId)?.name || 'Unknown',
                      )
                      .join(', ')}
                  </p>
                </div>
                <button
                  onClick={() => removeExpense(e.id)}
                  className="p-2 text-red-600 hover:text-red-800 transition duration-300 mt-2 sm:mt-0"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                </button>
              </li>
            ))}
          </ul>
          {expenses.length === 0 && (
            <p className="text-gray-500 text-center mt-4">No expenses added yet.</p>
          )}
        </div>
      </div>

      {/* Balances, Packing List, Currency Converter, AI Tips */}
      <div className="lg:col-span-1 space-y-8">
        {/* Balances Display */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-2xl font-bold text-[#3A4A3B] mb-4">Balances</h3>
          {participants.length === 0 && expenses.length === 0 ? (
            <p className="text-gray-500">Add participants and expenses to see balances.</p>
          ) : (
            <>
              <ul className="space-y-2 mb-4">
                {balances.map((b) => {
                  const participantName = participants.find((p) => p.id === b.participantId)?.name;
                  if (!participantName) return null; // Should not happen with proper data integrity
                  return (
                    <li
                      key={b.participantId}
                      className={`flex items-center justify-between p-3 rounded-md ${
                        b.amount < 0 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                      }`}
                    >
                      <span>{participantName}</span>
                      <span className="font-semibold">
                        {b.amount < 0 ? 'Owes' : 'Gets back'} ${Math.abs(b.amount).toFixed(2)}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <h4 className="text-xl font-semibold text-[#3A4A3B] mb-2">Who owes whom:</h4>
              <ul className="space-y-1">
                {whoOwesWhom.length > 0 ? (
                  whoOwesWhom.map((txn, index) => (
                    <li key={index} className="text-gray-700">
                      <span className="font-medium">
                        {participants.find((p) => p.id === txn.from)?.name}
                      </span>{' '}
                      owes{' '}
                      <span className="font-medium">
                        {participants.find((p) => p.id === txn.to)?.name}
                      </span>{' '}
                      ${txn.amount.toFixed(2)}
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">Everyone is settled up!</p>
                )}
              </ul>

              {/* Settle via UPI/PayPal Button */}
              <div className="mt-6 border-t border-gray-200 pt-4">
                <h4 className="text-xl font-semibold text-[#3A4A3B] mb-3">Settle Payments</h4>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleGeneratePaymentLink('upi')}
                    disabled={whoOwesWhom.length === 0}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Settle via UPI
                  </button>
                  <button
                    onClick={() => handleGeneratePaymentLink('paypal')}
                    disabled={whoOwesWhom.length === 0}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Settle via PayPal
                  </button>
                </div>
                {paymentLink && (
                  <div className="bg-gray-50 p-3 rounded-md mt-4 border border-gray-200">
                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-medium">
                        {paymentLink.method === 'upi' ? 'UPI' : 'PayPal'} Link
                      </span>{' '}
                      for: <span className="italic">{paymentLink.transactionDescription}</span>
                    </p>
                    <div className="flex items-center space-x-2">
                      <a
                        href={paymentLink.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-grow text-blue-500 hover:underline text-sm truncate"
                        title={paymentLink.link}
                      >
                        {paymentLink.link}
                      </a>
                      <button
                        onClick={handleCopyLink}
                        className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 transition duration-300"
                      >
                        Copy
                      </button>
                    </div>
                    {copyFeedback && (
                      <p className="text-xs text-green-600 mt-2">{copyFeedback}</p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Packing List */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-2xl font-bold text-[#3A4A3B] mb-4">Packing List</h3>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
            <input
              type="text"
              placeholder="Add packing item"
              value={newPackingItemText}
              onChange={(e) => setNewPackingItemText(e.target.value)}
              className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B46C1]"
            />
            <button
              onClick={addPackingItem}
              className="px-6 py-3 bg-[#6B46C1] text-white rounded-md hover:bg-[#553C9A] transition duration-300"
            >
              Add Item
            </button>
          </div>
          <ul className="space-y-2">
            {packingItems.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-200"
              >
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => togglePackingItem(item.id)}
                    className="form-checkbox h-5 w-5 text-[#805AD5] rounded"
                  />
                  <span
                    className={`ml-3 text-lg text-[#1A202C] ${item.completed ? 'line-through text-gray-500' : ''}`}
                  >
                    {item.text}
                  </span>
                </label>
                <button
                  onClick={() => removePackingItem(item.id)}
                  className="p-2 text-red-600 hover:text-red-800 transition duration-300"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                </button>
              </li>
            ))}
          </ul>
          {packingItems.length === 0 && (
            <p className="text-gray-500 text-center mt-4">No packing items added yet.</p>
          )}
        </div>

        {/* Currency Converter */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-2xl font-bold text-[#3A4A3B] mb-4">Currency Converter</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input
              type="number"
              placeholder="Amount"
              value={amountToConvert > 0 ? amountToConvert : ''}
              onChange={(e) => setAmountToConvert(parseFloat(e.target.value) || 0)}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B46C1]"
            />
            <select
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
              className="p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#6B46C1]"
            >
              {SUPPORTED_CURRENCIES.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
            <select
              value={targetCurrency}
              onChange={(e) => setTargetCurrency(e.target.value)}
              className="p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#6B46C1]"
            >
              {SUPPORTED_CURRENCIES.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>
          {convertedAmount !== null && amountToConvert > 0 && (
            <p className="text-lg text-[#1A202C] mt-4 font-semibold">
              {CURRENCY_SYMBOLS[baseCurrency]}
              {amountToConvert.toFixed(2)} is{' '}
              <span className="text-[#805AD5]">
                {CURRENCY_SYMBOLS[targetCurrency]}
                {convertedAmount.toFixed(2)}
              </span>
            </p>
          )}
          {amountToConvert <= 0 && (
            <p className="text-gray-500 mt-4">Enter a valid amount to convert.</p>
          )}
          {convertedAmount === null && amountToConvert > 0 && (
            <p className="text-red-500 mt-4">Conversion not available for selected currencies.</p>
          )}
        </div>

        {/* AI-powered Spending Tips */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-2xl font-bold text-[#3A4A3B] mb-4">AI-powered Spending Tips</h3>
          <AiSpendingTips
            totalBudget={totalBudget}
            spendingByCategory={spendingByCategory}
            expenses={expenses}
          />
        </div>
      </div>
    </div>
  );
};