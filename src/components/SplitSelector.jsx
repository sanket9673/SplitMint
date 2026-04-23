import React from 'react';
import { roundToTwo } from '../utils/rounding';

const SplitSelector = ({ group, splitMode, setSplitMode, splitData, setSplitData, totalAmount, activeParticipants, toggleParticipant }) => {
  const modes = [
    { id: 'equal', label: 'EQUAL =' },
    { id: 'custom', label: 'CUSTOM ₹' },
    { id: 'percentage', label: 'PERCENT %' }
  ];

  const handleCustomChange = (id, value) => {
    setSplitData({ ...splitData, [id]: value });
  };

  const getCustomSum = () => {
    return Object.values(splitData).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
  };

  const remainingCustom = roundToTwo(totalAmount - getCustomSum());
  const percentSum = getCustomSum();

  return (
    <div className="mt-6 border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex border-b border-gray-200 bg-gray-50">
        {modes.map(m => (
          <button
            key={m.id}
            type="button"
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              splitMode === m.id ? 'bg-white text-primary border-b-2 border-primary' : 'text-gray-500 hover:bg-gray-100'
            }`}
            onClick={() => setSplitMode(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="p-4 bg-white">
        {splitMode === 'custom' && (
          <div className="mb-4 text-sm font-medium flex justify-between">
            <span className="text-gray-600">Left to split:</span>
            <span className={remainingCustom === 0 ? 'text-success' : remainingCustom < 0 ? 'text-danger' : 'text-gray-900'}>
              ₹{remainingCustom.toFixed(2)}
            </span>
          </div>
        )}
        {splitMode === 'percentage' && (
          <div className="mb-4 text-sm font-medium flex justify-between">
            <span className="text-gray-600">Total Percentage:</span>
            <span className={percentSum === 100 ? 'text-success' : 'text-danger'}>
              {percentSum.toFixed(2)}%
            </span>
          </div>
        )}

        <div className="space-y-3">
          {group.participants.map(p => {
            const isActive = activeParticipants.includes(p.id);
            return (
              <div key={p.id} className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={isActive}
                  onChange={() => toggleParticipant(p.id)}
                  className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                />
                <span className="text-sm font-medium text-gray-700 flex-grow">{p.name}</span>
                
                {isActive && splitMode === 'custom' && (
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                    <input 
                      type="number" 
                      step="0.01"
                      className="pl-7 pr-3 py-1.5 border border-gray-300 rounded-md w-24 text-right text-sm focus:ring-primary focus:border-primary"
                      value={splitData[p.id] !== undefined ? splitData[p.id] : ''}
                      onChange={(e) => handleCustomChange(p.id, e.target.value)}
                    />
                  </div>
                )}
                
                {isActive && splitMode === 'percentage' && (
                  <div className="relative">
                    <input 
                      type="number" 
                      step="0.01"
                      className="pr-7 pl-3 py-1.5 border border-gray-300 rounded-md w-24 text-right text-sm focus:ring-primary focus:border-primary"
                      value={splitData[p.id] !== undefined ? splitData[p.id] : ''}
                      onChange={(e) => handleCustomChange(p.id, e.target.value)}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                  </div>
                )}
                
                {isActive && splitMode === 'equal' && (
                  <span className="text-sm text-gray-500 w-24 text-right">Included</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SplitSelector;
