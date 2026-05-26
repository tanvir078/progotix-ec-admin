import { Package, Users, ShoppingCart, FileText } from 'lucide-react';

const icons = {
  package: Package,
  users: Users,
  orders: ShoppingCart,
  default: FileText,
};

const EmptyState = ({ icon = 'default', message = 'No data found', action }) => {
  const Icon = icons[icon] || icons.default;

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-10">
      <div className="mb-4 rounded-full bg-slate-50 p-4">
        <Icon className="h-8 w-8 text-slate-400" />
      </div>
      <p className="text-sm font-bold text-slate-400">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;
