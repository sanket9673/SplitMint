import React from 'react';
import { Search } from 'lucide-react';

const FilterBar = ({ search, setSearch, filterPayer, setFilterPayer, participants }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Search expenses..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      
      <select 
        className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary outline-none bg-white"
        value={filterPayer}
        onChange={(e) => setFilterPayer(e.target.value)}
      >
        <option value="">All Payers</option>
        {participants.map(p => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
    </div>
  );
};

export default FilterBar;
