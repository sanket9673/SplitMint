import React from 'react';

const SummaryCards = ({ totalSpent, youOwe, owedToYou, netBalance }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
        <div className="text-sm text-gray-500 mb-1">Total Spent</div>
        <div className="text-xl font-bold text-gray-900">₹{totalSpent.toFixed(2)}</div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
        <div className="text-sm text-gray-500 mb-1">You Owe</div>
        <div className="text-xl font-bold text-danger">₹{youOwe.toFixed(2)}</div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
        <div className="text-sm text-gray-500 mb-1">Owed To You</div>
        <div className="text-xl font-bold text-success">₹{owedToYou.toFixed(2)}</div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
        <div className="text-sm text-gray-500 mb-1">Net Balance</div>
        <div className={`text-xl font-bold ${netBalance > 0 ? 'text-success' : netBalance < 0 ? 'text-danger' : 'text-gray-900'}`}>
          {netBalance > 0 ? '+' : ''}₹{Math.abs(netBalance).toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
