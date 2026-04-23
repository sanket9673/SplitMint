import { create } from 'zustand';

const useExpenseStore = create((set, get) => ({
  expenses: JSON.parse(localStorage.getItem('splitmint_expenses') || '[]'),

  saveExpenses: (expenses) => {
    set({ expenses });
    localStorage.setItem('splitmint_expenses', JSON.stringify(expenses));
  },

  addExpense: (expenseData) => {
    const { expenses, saveExpenses } = get();
    const newExpense = {
      ...expenseData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    saveExpenses([...expenses, newExpense]);
    return newExpense;
  },

  updateExpense: (id, expenseData) => {
    const { expenses, saveExpenses } = get();
    const updated = expenses.map(e => e.id === id ? { ...e, ...expenseData } : e);
    saveExpenses(updated);
  },

  deleteExpense: (id) => {
    const { expenses, saveExpenses } = get();
    saveExpenses(expenses.filter(e => e.id !== id));
  },

  deleteExpensesByGroup: (groupId) => {
    const { expenses, saveExpenses } = get();
    saveExpenses(expenses.filter(e => e.groupId !== groupId));
  }
}));

export default useExpenseStore;
