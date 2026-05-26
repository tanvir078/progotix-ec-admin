import { Loader2 } from 'lucide-react';

const Loading = ({ message = 'Loading...' }) => {
    return (
        <div className="grid min-h-screen place-items-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm font-semibold text-slate-500">{message}</p>
            </div>
        </div>
    );
};

export default Loading;
