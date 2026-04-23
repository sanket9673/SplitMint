import React, { useState } from 'react';
import { X, Trash2, UserPlus } from 'lucide-react';
import useGroupStore from '../store/groupStore';
import useExpenseStore from '../store/expenseStore';
import useAuthStore from '../store/authStore';

const COLOR_PALETTE = ["#6366F1","#F59E0B","#10B981","#EF4444","#8B5CF6","#06B6D4"];

const ManageMembersModal = ({ group, onClose }) => {
  const { currentUser } = useAuthStore();
  const { updateParticipantName, removeParticipant, addParticipant } = useGroupStore();
  const expenses = useExpenseStore(s => s.expenses);
  const [newName, setNewName] = useState('');

  const handleNameChange = (participantId, newNameVal) => {
    if (!newNameVal.trim()) return;
    updateParticipantName(group.id, participantId, newNameVal.trim());
  };

  const handleRemove = (participantId) => {
    if (participantId === currentUser.id) return;
    
    const hasLinkedExpenses = expenses.some(e => 
      (e.groupId === group.id) && 
      (e.payerId === participantId || e.splits.some(s => s.participantId === participantId))
    );

    if (hasLinkedExpenses) {
      if (!window.confirm("This participant has linked expenses. Removing them will mark those expenses as having an inactive payer/participant. Continue?")) {
        return;
      }
    }
    
    removeParticipant(group.id, participantId);
  };

  const handleAdd = () => {
    if (!newName.trim() || group.participants.length >= 4) return;
    
    const id = crypto.randomUUID();
    const availableColors = COLOR_PALETTE.filter(c => !group.participants.some(p => p.color === c));
    const nextColor = availableColors.length > 0 ? availableColors[0] : COLOR_PALETTE[group.participants.length % COLOR_PALETTE.length];
    
    addParticipant(group.id, {
      id,
      name: newName.trim(),
      color: nextColor,
      userId: null
    });
    setNewName('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Manage Members</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {group.participants.map(p => {
            const isMe = p.id === currentUser.id;
            return (
              <div key={p.id} className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0"
                  style={{ backgroundColor: p.color }}
                >
                  {p.name.substring(0, 2).toUpperCase()}
                </div>
                <input
                  type="text"
                  defaultValue={p.name}
                  onBlur={(e) => handleNameChange(p.id, e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
                  className="flex-grow px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                <button
                  onClick={() => handleRemove(p.id)}
                  disabled={isMe}
                  className={`p-2 rounded-lg transition-colors flex-shrink-0 ${isMe ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-danger hover:bg-red-50 cursor-pointer'}`}
                  title={isMe ? "You cannot remove yourself" : "Remove participant"}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <UserPlus size={16} /> Add Participant
          </h3>
          {group.participants.length < 4 ? (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="New member name..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                className="flex-grow px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                onClick={handleAdd}
                disabled={!newName.trim()}
                className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add
              </button>
            </div>
          ) : (
            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg border border-gray-200">
              Maximum 4 participants reached.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageMembersModal;
