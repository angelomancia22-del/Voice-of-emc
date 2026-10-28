import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('EMCI System Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.error(e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 max-w-lg w-full rounded-2xl p-6 text-center shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-100">
              System Notice: Temporary Display Error
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              An unexpected condition occurred while loading grievance state. You can restore default Eastern Mindoro College demonstration data to resolve this immediately.
            </p>
            {this.state.error && (
              <pre className="text-[11px] font-mono bg-slate-950 p-3 rounded-lg text-red-300 text-left overflow-x-auto max-h-32">
                {this.state.error.message}
              </pre>
            )}
            <div className="pt-2">
              <button
                onClick={this.handleReset}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2 mx-auto"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset to Clean Demonstration State</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
