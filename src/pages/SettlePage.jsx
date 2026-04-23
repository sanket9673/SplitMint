import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useGroupStore from '../store/groupStore';
import useBalanceStore from '../store/balanceStore';
import useAuthStore from '../store/authStore';
import { ArrowLeft, ArrowRight, CheckCircle2, Copy } from 'lucide-react';

const SettlePage = () => {
  const { groupId } = useParams();
  const group = useGroupStore(s => s.groups.find(g => g.id === groupId));
  const getGroupBalance = useBalanceStore(s => s.getGroupBalance);
  const { currentUser } = useAuthStore();
  const [copied, setCopied] = useState(false);

  if (!group) return <div>Group not found</div>;

  const { settlements } = getGroupBalance(groupId) || { settlements: [], netBalances: {} };

  const handleCopy = () => {
    const text = settlements.map(s => {
      const from = group.participants.find(p => p.id === s.from)?.name;
      const to = group.participants.find(p => p.id === s.to)?.name;
      return `${from} owes ${to} ₹${s.amount.toFixed(2)}`;
    }).join('\n');
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <Link to={`/group/${groupId}`} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Settle Up</h1>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Minimal Settlement Path</h2>
        <p className="text-gray-500 mb-6">The most efficient way to settle all debts in this group.</p>
        
        {settlements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6">
            <CheckCircle2 size={48} className="text-success mb-4" />
            <p className="text-lg font-medium text-gray-900">All settled up!</p>
            <p className="text-gray-500 mt-1">No one owes anything in this group.</p>
          </div>
        ) : (
          <div className="space-y-4 text-left">
            {settlements.map((s, i) => {
              const fromP = group.participants.find(p => p.id === s.from);
              const toP = group.participants.find(p => p.id === s.to);
              
              const isMe = s.from === currentUser.id || s.to === currentUser.id;

              return (
                <div key={i} className={`flex items-center justify-between p-4 rounded-lg border ${isMe ? 'border-primary/30 bg-primary/5' : 'border-gray-100 bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium" style={{ backgroundColor: fromP?.color }}>
                      {fromP?.name.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-900">{fromP?.name}</span>
                  </div>
                  
                  <div className="flex flex-col items-center px-4">
                    <span className="text-sm font-semibold text-gray-700 bg-white px-3 py-1 rounded-full border border-gray-200">
                      ₹{s.amount.toFixed(2)}
                    </span>
                    <ArrowRight size={16} className="text-gray-400 mt-1" />
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900">{toP?.name}</span>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium" style={{ backgroundColor: toP?.color }}>
                      {toP?.name.substring(0, 2).toUpperCase()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {settlements.length > 0 && (
        <div className="flex justify-center">
          <button 
            onClick={handleCopy}
            className="flex items-center gap-2 bg-white border border-gray-200 px-6 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            {copied ? <CheckCircle2 size={18} className="text-success" /> : <Copy size={18} />}
            {copied ? 'Copied to clipboard' : 'Copy Settlements'}
          </button>
        </div>
      )}
    </div>
  );
};

export default SettlePage;
