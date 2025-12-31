import { Loader2 } from 'lucide-react';

export const Loader = ({ size = 18, className = "" }: { size?: number, className?: string }) => (
    <Loader2 size={size} className={`animate-spin text-blue-500 ${className}`} />
);
