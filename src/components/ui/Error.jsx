import { AlertCircle, RefreshCw } from 'lucide-react';

const Error = ({ message = 'Something went wrong', onRetry }) => {
    return (
        <div className="grid min-h-screen place-items-center bg-background px-6">
            <div className="flex max-w-md flex-col items-center rounded-2xl border border-danger bg-danger-light p-10 text-center">
                <div className="mb-4 rounded-full bg-danger bg-opacity-10 p-4">
                    <AlertCircle className="h-10 w-10 text-danger" />
                </div>
                <h2 className="mb-2 text-xl font-black text-slate-900">Error</h2>
                <p className="mb-6 text-sm font-semibold text-slate-600">{message}</p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-black text-white transition hover:bg-primary-dark"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                    </button>
                )}
            </div>
        </div>
    );
};

export default Error;
