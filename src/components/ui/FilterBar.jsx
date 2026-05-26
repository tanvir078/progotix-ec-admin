import { Search, X } from 'lucide-react';

const FilterBar = ({ 
  searchValue, 
  onSearchChange, 
  searchPlaceholder = 'Search...',
  filters = [], 
  onApply, 
  onReset,
  className = '' 
}) => {
  return (
    <form onSubmit={onApply} className={`mb-6 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-sm font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
        {searchValue && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {filters.map((filter) => (
        <select
          key={filter.key}
          value={filter.value}
          onChange={(e) => filter.onChange(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value="">{filter.placeholder}</option>
          {filter.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ))}
      <div className="flex gap-3">
        <button type="submit" className="rounded-xl bg-primary px-5 py-3 text-sm font-black text-white transition hover:bg-primary-hover">
          Filter
        </button>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
          >
            Reset
          </button>
        )}
      </div>
    </form>
  );
};

export default FilterBar;
