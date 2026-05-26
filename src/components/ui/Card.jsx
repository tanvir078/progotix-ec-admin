const Card = ({ children, className = '', title, action, noPadding = false }) => {
  return (
    <section className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          {title && <h2 className="text-sm font-black text-slate-950">{title}</h2>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>{children}</div>
    </section>
  );
};

export default Card;
