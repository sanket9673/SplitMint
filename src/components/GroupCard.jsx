import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import useBalanceStore from '../store/balanceStore';
import useAuthStore from '../store/authStore';
import ParticipantBadge from './ParticipantBadge';

const GroupCard = ({ group }) => {
  const { currentUser } = useAuthStore();
  const balanceData = useBalanceStore.getState().getGroupBalance(group.id);
  
  const myNet = balanceData?.netBalances[currentUser.id] || 0;
  
  return (
    <Link to={`/group/${group.id}`} className="block">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
          <ChevronRight className="text-gray-400" size={20} />
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {group.participants.map(p => (
            <ParticipantBadge key={p.id} participant={p} size="sm" />
          ))}
        </div>
        
        <div className="pt-4 border-t border-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Your Balance</span>
            <span className={`font-semibold ${myNet > 0 ? 'text-success' : myNet < 0 ? 'text-danger' : 'text-gray-500'}`}>
              {myNet > 0 ? '+' : ''}₹{Math.abs(myNet).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GroupCard;
