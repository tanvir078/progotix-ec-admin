const FormInput = ({ label, error, className = '', ...props }) => {
  return (
    <div className={className}>
      {label && <label className="mb-1 block text-xs font-black text-slate-600">{label}</label>}
      <input
        className={`w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none transition focus:border-primary focus:ring-1 focus:ring-primary ${error ? 'border-danger focus:border-danger focus:ring-danger' : ''}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs font-bold text-danger">{error}</p>}
    </div>
  );
};

export default FormInput;
