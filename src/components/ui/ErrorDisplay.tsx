import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorDisplayProps {
    message: string;
    onRetry: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => (
    <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl text-center space-y-5">
    <div className="bg-red-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-red-500/10">
        <AlertTriangle className="text-red-500" size={32} />
    </div>
    <div>
        <h2 className="text-lg font-bold">Error de sincronización</h2>
        <p className="text-slate-400 text-xs mt-1 leading-relaxed">{message}</p>
    </div>
    <button 
        onClick={onRetry}
        className="bg-white text-black px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors cursor-pointer"
    >
        Reintentar Conexión
    </button>
    </div>
);
