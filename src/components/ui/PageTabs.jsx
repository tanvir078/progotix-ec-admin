const PageTabs = ({ tabs, active, onChange }) => {
  return (
    <div className="mb-6 overflow-x-auto border-b border-slate-200">
      <div className="flex min-w-max gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const selected = active === tab.value;

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onChange(tab.value)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-black transition ${
                selected
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {tab.label}
              {tab.count !== undefined && (
                <span className={`rounded-full px-2 py-0.5 text-[11px] ${
                  selected ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PageTabs;
