import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useGroupStore from '../store/groupStore';
import useExpenseStore from '../store/expenseStore';
import useAuthStore from '../store/authStore';
import ColorLedger from '../components/ColorLedger';
import FilterBar from '../components/FilterBar';
import { ArrowLeft } from 'lucide-react';

const HistoryPage = () => {
  const { groupId } = useParams();
  const group = useGroupStore(s => s.groups.find(g => g.id === groupId));
  const { expenses, deleteExpense } = useExpenseStore();
  const { currentUser } = useAuthStore();
  
  const [search, setSearch] = useState('');
  const [filterPayer, setFilterPayer] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterAmountMin, setFilterAmountMin] = useState('');
  const [filterAmountMax, setFilterAmountMax] = useState('');
  
  if (!group) return <div>Group not found</div>;

  const groupExpenses = expenses.filter(e => e.groupId === groupId);

  const filteredExpenses = groupExpenses.filter(e => {
    if (search && !e.description.toLowerCase().includes(search.toLowerCase())) return false;
    
    if (filterPayer) {
      const isInvolved =
        e.payerId === filterPayer ||
        (e.splits && e.splits.some(s => s.participantId === filterPayer));
      if (!isInvolved) return false;
    }

    if (filterDateFrom && new Date(e.date) < new Date(filterDateFrom)) return false;
    if (filterDateTo && new Date(e.date) > new Date(filterDateTo)) return false;
    if (filterAmountMin && e.amount < parseFloat(filterAmountMin)) return false;
    if (filterAmountMax && e.amount > parseFloat(filterAmountMax)) return false;
    
    return true;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).reverse();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={`/group/${groupId}`} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
        </div>
        
        {Boolean(search || filterPayer || filterDateFrom || filterDateTo || filterAmountMin || filterAmountMax) && (
          <button 
            onClick={() => {
              setSearch('');
              setFilterPayer('');
              setFilterDateFrom('');
              setFilterDateTo('');
              setFilterAmountMin('');
              setFilterAmountMax('');
            }}
            className="text-sm text-indigo-500 hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      <FilterBar 
        search={search} setSearch={setSearch} 
        filterPayer={filterPayer} setFilterPayer={setFilterPayer}
        filterDateFrom={filterDateFrom} setFilterDateFrom={setFilterDateFrom}
        filterDateTo={filterDateTo} setFilterDateTo={setFilterDateTo}
        filterAmountMin={filterAmountMin} setFilterAmountMin={setFilterAmountMin}
        filterAmountMax={filterAmountMax} setFilterAmountMax={setFilterAmountMax}
        participants={group.participants}
      />

      <ColorLedger 
        expenses={filteredExpenses} 
        group={group} 
        myId={currentUser.id} 
        onDelete={deleteExpense}
      />
    </div>
  );
};

export default HistoryPage;
