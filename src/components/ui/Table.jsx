const Table = ({ columns, data, emptyMessage = 'No data found', className = '' }) => {
  if (!data || data.length === 0) {
    return (
      <div className={`rounded-2xl border border-slate-200 bg-white p-10 text-center ${className}`}>
        <p className="text-sm font-bold text-slate-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-2xl border border-slate-200 ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className={`px-5 py-4 ${column.className || ''}`}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="transition hover:bg-slate-50">
                {columns.map((column) => (
                  <td key={column.key} className={`px-5 py-4 ${column.cellClassName || ''}`}>
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
