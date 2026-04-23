import React from 'react';

const BalanceTable = ({ participants, owes }) => {
  if(!participants || !owes) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left align-middle border-collapse border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 border border-gray-200"></th>
            {participants.map(p => (
              <th key={p.id} className="p-3 border border-gray-200 text-center truncate max-w-[100px]">{p.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {participants.map(p1 => (
            <tr key={`row-${p1.id}`}>
              <td className="p-3 border border-gray-200 font-medium bg-gray-50">{p1.name}</td>
              {participants.map(p2 => {
                if (p1.id === p2.id) return <td key={`cell-${p1.id}-${p2.id}`} className="p-3 border border-gray-200 bg-gray-100"></td>;
                
                const amtOwed = owes[p1.id] && owes[p1.id][p2.id] ? owes[p1.id][p2.id] : 0;
                const isOwed = owes[p2.id] && owes[p2.id][p1.id] ? owes[p2.id][p1.id] : 0;

                let content = '-';
                let className = 'text-gray-400 text-center';

                if (amtOwed > 0) {
                  content = `owes ₹${amtOwed.toFixed(2)}`;
                  className = 'text-danger text-center font-medium';
                } else if (isOwed > 0) {
                  content = `is owed ₹${isOwed.toFixed(2)}`;
                  className = 'text-success text-center font-medium';
                }

                return (
                  <td key={`cell-${p1.id}-${p2.id}`} className={`p-3 border border-gray-200 ${className}`}>
                    {content}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BalanceTable;
