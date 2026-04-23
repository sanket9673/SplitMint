import React from 'react';
import { Search } from 'lucide-react';

const FilterBar = ({ 
  search, setSearch, 
  filterPayer, setFilterPayer, 
  filterDateFrom, setFilterDateFrom,
  filterDateTo, setFilterDateTo,
  filterAmountMin, setFilterAmountMin,
  filterAmountMax, setFilterAmountMax,
  participants 
}) => {
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
      
      <input 
        type="date"
        className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary outline-none"
        value={filterDateFrom}
        onChange={(e) => setFilterDateFrom(e.target.value)}
        title="Date From"
      />
      <input 
        type="date"
        className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary outline-none"
        value={filterDateTo}
        onChange={(e) => setFilterDateTo(e.target.value)}
        title="Date To"
      />
      <input 
        type="number"
        placeholder="Min ₹"
        className="w-24 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary outline-none"
        value={filterAmountMin}
        onChange={(e) => setFilterAmountMin(e.target.value)}
      />
      <input 
        type="number"
        placeholder="Max ₹"
        className="w-24 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary outline-none"
        value={filterAmountMax}
        onChange={(e) => setFilterAmountMax(e.target.value)}
      />
    </div>
  );
};

export default FilterBar;
