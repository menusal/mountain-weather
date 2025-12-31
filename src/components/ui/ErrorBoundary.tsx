import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="bg-red-500/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto border border-red-500/20 shadow-2xl shadow-red-500/10">
              <AlertTriangle className="text-red-500" size={32} />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-black tracking-tight text-white">Oops, algo salió mal</h2>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                La aplicación ha encontrado un error inesperado. Hemos guardado los detalles para revisarlos.
              </p>
            </div>

            {error && (
              <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 text-left text-wrap">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Detalles técnicos</p>
                <code className="text-xs text-red-400 font-mono break-all line-clamp-3">
                  {error.message}
                </code>
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="flex items-center gap-2 bg-white text-slate-950 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all active:scale-95 shadow-xl shadow-white/5 mx-auto"
            >
              <RefreshCw size={14} />
              Reiniciar aplicación
            </button>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
