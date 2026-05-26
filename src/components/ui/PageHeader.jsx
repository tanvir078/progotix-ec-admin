const PageHeader = ({ title, breadcrumb, actions }) => {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        {breadcrumb && <p className="mb-1 text-xs font-semibold text-slate-500">{breadcrumb}</p>}
        <h1 className="text-2xl font-black tracking-tight text-slate-950">{title}</h1>
      </div>
      {actions && <div className="flex gap-3">{actions}</div>}
    </div>
  );
};

export default PageHeader;
