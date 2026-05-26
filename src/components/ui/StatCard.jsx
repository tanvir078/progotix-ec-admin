import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ label, value, trend, href, icon: Icon, className = '' }) => {
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  const content = (
    <div className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-black text-slate-950">{value}</p>
          {trend !== undefined && (
            <div className={`mt-2 flex items-center gap-1 text-xs font-bold ${isPositive ? 'text-success' : isNegative ? 'text-danger' : 'text-slate-500'}`}>
              {isPositive ? <TrendingUp className="h-3 w-3" /> : isNegative ? <TrendingDown className="h-3 w-3" /> : null}
              <span>{Math.abs(trend)}%</span>
              <span className="text-slate-400">vs last period</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="rounded-xl bg-slate-50 p-3">
            <Icon className="h-5 w-5 text-slate-600" />
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link to={href}>{content}</Link>;
  }

  return content;
};

export default StatCard;
