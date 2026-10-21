import { Component, ErrorInfo, ReactNode, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class RootErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-screen h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-lg p-8 rounded-3xl bg-slate-900 border-2 border-rose-500/50 shadow-2xl space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center text-3xl font-black">
              ⚠️
            </div>
            <h1 className="text-2xl font-black text-rose-300">
              Terjadi Kendala Memuat Aplikasi
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Silakan muat ulang halaman atau periksa koneksi internet Anda.
            </p>
            {this.state.error?.message && (
              <pre className="p-3 text-xs bg-slate-950 rounded-xl text-rose-200 overflow-x-auto text-left max-h-32">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={this.handleReload}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm shadow-lg transition-all cursor-pointer active:scale-95"
            >
              🔄 Muat Ulang Halaman
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const mountApp = () => {
  const container = document.getElementById('root');
  if (!container) return;

  createRoot(container).render(
    <StrictMode>
      <RootErrorBoundary>
        <App />
      </RootErrorBoundary>
    </StrictMode>
  );
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}
