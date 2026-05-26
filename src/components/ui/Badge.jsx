const Badge = ({ value, className = '' }) => {
  const colors = {
    pending: 'bg-warning-light text-warning-dark ring-warning',
    processing: 'bg-blue-50 text-blue-700 ring-blue-200',
    shipped: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
    delivered: 'bg-success-light text-success-dark ring-success',
    cancelled: 'bg-danger-light text-danger-dark ring-danger',
    returned: 'bg-purple-50 text-purple-700 ring-purple-200',
    refunded: 'bg-purple-50 text-purple-700 ring-purple-200',
    paid: 'bg-success-light text-success-dark ring-success',
    unpaid: 'bg-slate-50 text-slate-700 ring-slate-200',
    partially_refunded: 'bg-purple-50 text-purple-700 ring-purple-200',
    active: 'bg-success-light text-success-dark ring-success',
    inactive: 'bg-slate-50 text-slate-700 ring-slate-200',
    draft: 'bg-slate-50 text-slate-700 ring-slate-200',
    published: 'bg-success-light text-success-dark ring-success',
    featured: 'bg-amber-50 text-amber-700 ring-amber-200',
    low_stock: 'bg-danger-light text-danger-dark ring-danger',
    in_stock: 'bg-success-light text-success-dark ring-success',
    out_of_stock: 'bg-danger-light text-danger-dark ring-danger',
    partial: 'bg-amber-50 text-amber-700 ring-amber-200',
    attention: 'bg-warning-light text-warning-dark ring-warning',
    local: 'bg-blue-50 text-blue-700 ring-blue-200',
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black capitalize ring-1 ${colors[value] || 'bg-slate-50 text-slate-700 ring-slate-200'} ${className}`}>
      {String(value || 'unknown').replace(/_/g, ' ')}
    </span>
  );
};

export default Badge;
