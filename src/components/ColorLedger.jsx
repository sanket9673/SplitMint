import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, Trash2, Pencil } from 'lucide-react';

const ColorLedger = ({ expenses, group, myId, onDelete }) => {
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();

  const handleDelete = (expenseId) => {
    if (window.confirm('Delete this expense? This will recalculate all balances.')) {
      onDelete(expenseId);
    }
  };

  if (!expenses.length) {
    return (
      <div className="text-center py-10 bg-white rounded-xl border border-gray-100">
        <p className="text-gray-500">No expenses found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {expenses.map((expense) => {
        const payer = group.participants.find(p => p.id === expense.payerId);
        const isExpanded = expandedId === expense.id;
        
        let myShareObj = expense.splits.find(s => s.participantId === myId);
        let myShare = myShareObj ? myShareObj.amount : 0;
        let isPayer = expense.payerId === myId;
        
        let netForMe = 0;
        if (isPayer) {
          netForMe = expense.amount - myShare;
        } else {
          netForMe = -myShare;
        }

        return (
          <div key={expense.id} className="border-b border-gray-50 last:border-0 relative">
            <div 
              className="absolute left-0 top-0 bottom-0 w-1.5"
              style={{ backgroundColor: payer?.color || '#cbd5e1' }}
            />
            <div 
              className="p-4 pl-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpandedId(isExpanded ? null : expense.id)}
            >
              <div className="flex-grow">
                <div className="font-semibold text-gray-900">{expense.description || 'Untitled Expense'}</div>
                <div className="text-xs text-gray-500 mt-1 flex gap-2">
                  <span>{payer?.name} paid ₹{expense.amount.toFixed(2)}</span>
                  <span>•</span>
                  <span>{format(new Date(expense.date || expense.createdAt), 'MMM d, yyyy')}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-right">
                <div className="hidden sm:block">
                  {netForMe > 0 && <span className="text-success text-sm font-medium">You're owed ₹{netForMe.toFixed(2)}</span>}
                  {netForMe < 0 && <span className="text-danger text-sm font-medium">You owe ₹{Math.abs(netForMe).toFixed(2)}</span>}
                  {netForMe === 0 && <span className="text-gray-500 text-sm">Not involved</span>}
                </div>
                {isExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
              </div>
            </div>

            {isExpanded && (
              <div className="bg-gray-50 p-4 pl-6 border-t border-gray-100 flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Split Details ({expense.splitMode})</h4>
                  <ul className="space-y-1">
                    {expense.splits.map(split => {
                      const p = group.participants.find(p => p.id === split.participantId);
                      return (
                        <li key={split.participantId} className="text-sm flex gap-2">
                          <span className="font-medium text-gray-700 w-24">{p?.name}:</span>
                          <span className="text-gray-600">₹{split.amount.toFixed(2)}</span>
                          {expense.splitMode === 'percentage' && <span className="text-gray-400">({split.percentage.toFixed(1)}%)</span>}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); navigate(`/group/${group.id}/expense/${expense.id}`); }}
                    className="p-2 text-gray-400 hover:text-indigo-500 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit Expense"
                  >
                    <Pencil size={16} />
                  </button>
                  {onDelete && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(expense.id); }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Expense"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ColorLedger;
