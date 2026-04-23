import { create } from 'zustand';
import { computeGroupBalances } from '../utils/balanceEngine';
import useExpenseStore from './expenseStore';
import useGroupStore from './groupStore';

const useBalanceStore = create((set, get) => ({
  getGroupBalance: (groupId) => {
    const expenses = useExpenseStore.getState().expenses.filter(e => e.groupId === groupId);
    const group = useGroupStore.getState().groups.find(g => g.id === groupId);
    if (!group) return { netBalances: {}, owes: {}, settlements: [] };
    return computeGroupBalances(group.participants, expenses);
  }
}));

export default useBalanceStore;
