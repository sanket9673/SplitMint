import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useGroupStore from '../store/groupStore';
import useExpenseStore from '../store/expenseStore';
import useBalanceStore from '../store/balanceStore';
import { Settings, Plus, PiggyBank, History, Trash2, Users, PieChart as PieChartIcon, Pencil } from 'lucide-react';
import BalanceTable from '../components/BalanceTable';
import ParticipantBadge from '../components/ParticipantBadge';
import MintSenseBar from '../components/MintSenseBar';
import ManageMembersModal from '../components/ManageMembersModal';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const GroupPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const group = useGroupStore(s => s.groups.find(g => g.id === groupId));
  const deleteGroup = useGroupStore(s => s.deleteGroup);
  const updateGroup = useGroupStore(s => s.updateGroup);
  const deleteExpensesByGroup = useExpenseStore(s => s.deleteExpensesByGroup);
  const expenses = useExpenseStore(s => s.expenses.filter(e => e.groupId === groupId));
  const getGroupBalance = useBalanceStore(s => s.getGroupBalance);

  if (!group) return <div>Group not found</div>;

  const { netBalances, owes } = getGroupBalance(groupId) || { netBalances: {}, owes: {} };
  const [showManageMembers, setShowManageMembers] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(group?.name || '');
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this group? All expenses will be lost.")) {
      deleteExpensesByGroup(groupId);
      deleteGroup(groupId);
      navigate('/');
    }
  };

  const barData = group.participants.map(p => {
    const paid = expenses.filter(e => e.payerId === p.id).reduce((sum, e) => sum + e.amount, 0);
    const share = expenses.reduce((sum, e) => {
      const split = e.splits.find(s => s.participantId === p.id);
      return sum + (split ? split.amount : 0);
    }, 0);
    const net = netBalances[p.id] || 0;
    return { name: p.name, Paid: paid, Share: share, net: net > 0 ? net : 0 };
  });

  const pieData = expenses.reduce((acc, exp) => {
    const category = exp.category || 'Other';
    const existing = acc.find(x => x.name === category);
    if (existing) existing.value += exp.amount;
    else acc.push({ name: category, value: exp.amount });
    return acc;
  }, []);
  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2">
            {editingName ? (
              <input
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                onBlur={() => {
                  if (nameInput.trim() && nameInput.trim() !== group.name) {
                    updateGroup(groupId, { name: nameInput.trim() });
                  }
                  setEditingName(false);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') e.target.blur();
                  if (e.key === 'Escape') { setNameInput(group.name); setEditingName(false); }
                }}
                autoFocus
                className="text-2xl font-bold bg-transparent border-b-2 border-indigo-500 outline-none text-gray-900"
              />
            ) : (
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {group.name}
              </h1>
            )}
            {!editingName && (
              <button onClick={() => setEditingName(true)} className="ml-2 text-gray-400 hover:text-indigo-500">
                <Pencil size={16} />
              </button>
            )}
          </div>
          <div className="flex gap-1 mt-2 items-center">
            {group.participants.map(p => (
              <ParticipantBadge key={p.id} participant={p} size="sm" />
            ))}
            <button 
              onClick={() => setShowManageMembers(true)}
              className="ml-2 text-gray-400 hover:text-primary transition-colors"
              title="Manage Members"
            >
              <Users size={18} />
            </button>
            <span className="ml-4 text-sm font-semibold py-1 px-3 bg-gray-100 text-gray-700 rounded-full border border-gray-200">
              Total Spent: ₹{totalSpent.toFixed(2)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Link to={`/group/${groupId}/history`} className="bg-white border text-gray-700 border-gray-200 px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors">
            <History size={18} /> History
          </Link>
          <Link to={`/group/${groupId}/settle`} className="bg-white border text-primary border-primary/20 px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-primary/5 transition-colors">
            <PiggyBank size={18} /> Settle Up
          </Link>
          <Link to={`/group/${groupId}/expense/new`} className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
            <Plus size={18} /> Add
          </Link>
          <button onClick={handleDelete} className="text-red-500 p-2 hover:bg-red-50 rounded-lg" title="Delete Group">
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <MintSenseBar group={group} mode="summary" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4">Balance Matrix</h2>
          <BalanceTable participants={group.participants} owes={owes} />
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <PieChartIcon size={20} className="text-gray-500" />
            Contribution vs Share
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="Paid" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Total Paid" />
                <Bar dataKey="Share" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Their Share" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {pieData.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 w-full lg:w-1/2">
           <h2 className="text-lg font-bold mb-4">Expenses by Category</h2>
           <div className="h-64 flex justify-center">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                </PieChart>
             </ResponsiveContainer>
           </div>
        </div>
      )}
      
      {showManageMembers && (
        <ManageMembersModal group={group} onClose={() => setShowManageMembers(false)} />
      )}
    </>
  );
};

export default GroupPage;
