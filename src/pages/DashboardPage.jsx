import React, { useState } from 'react';
import useAuthStore from '../store/authStore';
import useGroupStore from '../store/groupStore';
import useExpenseStore from '../store/expenseStore';
import useBalanceStore from '../store/balanceStore';
import GroupCard from '../components/GroupCard';
import SummaryCards from '../components/SummaryCards';
import { Plus, Users } from 'lucide-react';

const DashboardPage = () => {
  const { currentUser } = useAuthStore();
  const { groups, createGroup } = useGroupStore();
  const getGroupBalance = useBalanceStore(s => s.getGroupBalance);
  
  const userGroups = groups.filter(g => g.ownerId === currentUser.id);
  const [showCreate, setShowCreate] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [participants, setParticipants] = useState(['', '', '']); // up to 3 extra

  let totalSpent = 0;
  let youOwe = 0;
  let owedToYou = 0;

  userGroups.forEach(g => {
    const expenses = useExpenseStore.getState().expenses.filter(e => e.groupId === g.id);
    const spentInGroup = expenses.reduce((sum, e) => sum + e.amount, 0);
    totalSpent += spentInGroup;

    const balanceData = getGroupBalance(g.id);
    if(balanceData && balanceData.netBalances) {
      const myNet = balanceData.netBalances[currentUser.id] || 0;
      if (myNet > 0) owedToYou += myNet;
      else if (myNet < 0) youOwe += Math.abs(myNet);
    }
  });

  const netBalance = owedToYou - youOwe;

  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    
    const validParticipants = participants.filter(p => p.trim() !== '');
    try {
      createGroup(newGroupName, validParticipants);
      setShowCreate(false);
      setNewGroupName('');
      setParticipants(['', '', '']);
    } catch (err) {
      alert(err.message);
    }
  };

  const updateParticipant = (index, value) => {
    const newPs = [...participants];
    newPs[index] = value;
    setParticipants(newPs);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back, {currentUser?.name}</p>
        </div>
        <button 
          onClick={() => setShowCreate(true)}
          disabled={userGroups.length >= 3}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={userGroups.length >= 3 ? "Max 3 groups allowed" : ""}
        >
          <Plus size={20} />
          <span className="hidden sm:inline">New Group</span>
        </button>
      </div>

      <SummaryCards 
        totalSpent={totalSpent} 
        youOwe={youOwe} 
        owedToYou={owedToYou} 
        netBalance={netBalance} 
      />

      {showCreate && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-lg font-semibold mb-4">Create New Group</h2>
          <form onSubmit={handleCreateGroup}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="e.g. Goa Trip"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Add Participants (max 3)</label>
              <div className="space-y-3">
                {participants.map((p, i) => (
                  <input 
                    key={i}
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    value={p}
                    onChange={(e) => updateParticipant(i, e.target.value)}
                    placeholder={`Participant ${i + 1} Name (Optional)`}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-primary text-white rounded-lg font-medium"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Groups</h2>
        {userGroups.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
            <Users className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900">No groups yet</h3>
            <p className="text-gray-500 mt-1">Create your first group to start splitting expenses.</p>
            <button 
              onClick={() => setShowCreate(true)}
              className="mt-4 text-primary font-medium hover:underline"
            >
              + Create a Group
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userGroups.map(g => (
              <GroupCard key={g.id} group={g} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardPage;
