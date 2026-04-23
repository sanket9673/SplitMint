import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useGroupStore from '../store/groupStore';
import useExpenseStore from '../store/expenseStore';
import SplitSelector from '../components/SplitSelector';
import MintSenseBar from '../components/MintSenseBar';
import { calculateSplits } from '../utils/splitCalculator';
import { roundToTwo } from '../utils/rounding';
import { ArrowLeft } from 'lucide-react';

const CATEGORIES = ['Food', 'Travel', 'Entertainment', 'Utilities', 'Shopping', 'Other'];

const ExpensePage = () => {
  const { groupId, expenseId } = useParams();
  const navigate = useNavigate();
  const group = useGroupStore(s => s.groups.find(g => g.id === groupId));
  const { expenses, addExpense, updateExpense } = useExpenseStore();
  
  const existingExpense = expenseId ? expenses.find(e => e.id === expenseId) : null;

  const [description, setDescription] = useState(existingExpense?.description || '');
  const [amount, setAmount] = useState(existingExpense ? existingExpense.amount.toString() : '');
  const [date, setDate] = useState(existingExpense?.date ? existingExpense.date.split('T')[0] : new Date().toISOString().split('T')[0]);
  const [payerId, setPayerId] = useState(existingExpense?.payerId || (group ? group.participants[0].id : ''));
  const [category, setCategory] = useState(existingExpense?.category || 'Other');
  const [splitMode, setSplitMode] = useState(existingExpense?.splitMode || 'equal');
  
  const initialActive = existingExpense 
    ? existingExpense.splits.map(s => s.participantId)
    : group?.participants.map(p => p.id) || [];
  const [activeParticipants, setActiveParticipants] = useState(initialActive);

  const initialSplitData = {};
  if (existingExpense && (existingExpense.splitMode === 'custom' || existingExpense.splitMode === 'percentage')) {
    existingExpense.splits.forEach(s => {
      initialSplitData[s.participantId] = existingExpense.splitMode === 'custom' ? s.amount : s.percentage;
    });
  }
  const [splitData, setSplitData] = useState(initialSplitData);
  const [error, setError] = useState('');

  if (!group) return <div>Group not found</div>;

  const toggleParticipant = (id) => {
    if (activeParticipants.includes(id)) {
      if (activeParticipants.length <= 2) {
        setError("At least 2 participants required");
        return;
      }
      setActiveParticipants(activeParticipants.filter(pId => pId !== id));
      setError('');
    } else {
      setActiveParticipants([...activeParticipants, id]);
      setError('');
    }
  };

  const handleAIExtract = (parsed) => {
    if (parsed.description) setDescription(parsed.description);
    if (parsed.amount) setAmount(parsed.amount.toString());
    if (parsed.date) setDate(parsed.date.split('T')[0]);
    if (parsed.splitMode && ['equal', 'custom', 'percentage'].includes(parsed.splitMode)) {
      setSplitMode(parsed.splitMode);
    }
    if (parsed.payer) {
      const match = group.participants.find(p => p.name.toLowerCase().includes(parsed.payer.toLowerCase()));
      if (match) setPayerId(match.id);
    }
    if (parsed.category) {
      const validCategories = ['Food', 'Travel', 'Entertainment', 'Utilities', 'Shopping', 'Other'];
      if (validCategories.includes(parsed.category)) {
        setCategory(parsed.category);
      } else {
        setCategory('Other');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    
    if (!numAmount || numAmount <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    if (activeParticipants.length < 2) {
      setError("At least 2 participants required for a split");
      return;
    }

    const participantsToSplit = group.participants.filter(p => activeParticipants.includes(p.id));
    const splits = calculateSplits(numAmount, splitMode, participantsToSplit, splitData);

    if (splitMode === 'custom') {
      const sum = splits.reduce((acc, curr) => acc + curr.amount, 0);
      if (Math.abs(sum - numAmount) > 0.01) {
        setError(`Custom amounts must sum to total amount. Currently: ${sum}`);
        return;
      }
    } else if (splitMode === 'percentage') {
      const sum = splits.reduce((acc, curr) => acc + curr.percentage, 0);
      if (Math.abs(sum - 100) > 0.01) {
        setError(`Percentages must sum to 100%. Currently: ${sum}%`);
        return;
      }
    }

    const expenseData = {
      groupId,
      description,
      amount: roundToTwo(numAmount),
      date: new Date(date).toISOString(),
      payerId,
      category,
      splitMode,
      splits
    };

    if (existingExpense) {
      updateExpense(existingExpense.id, expenseData);
    } else {
      addExpense(expenseData);
    }

    navigate(`/group/${groupId}`);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{existingExpense ? 'Edit Expense' : 'Add Expense'}</h1>
      </div>

      {!existingExpense && <MintSenseBar group={group} onExtracted={handleAIExtract} mode="expense" />}

      {error && <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 font-medium border border-red-100">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input 
            type="text" 
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Dinner at Pizza Hut"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount (₹)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
              <input 
                type="number" 
                step="0.01"
                required
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-lg font-medium"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input 
              type="date" 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paid By</label>
            <select 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
              value={payerId}
              onChange={(e) => setPayerId(e.target.value)}
            >
              {group.participants.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Split Method</label>
           <SplitSelector 
             group={group} 
             splitMode={splitMode} 
             setSplitMode={setSplitMode}
             splitData={splitData}
             setSplitData={setSplitData}
             totalAmount={parseFloat(amount) || 0}
             activeParticipants={activeParticipants}
             toggleParticipant={toggleParticipant}
           />
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
          <button 
            type="button" 
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors"
          >
            {existingExpense ? 'Save Changes' : 'Add Expense'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpensePage;
