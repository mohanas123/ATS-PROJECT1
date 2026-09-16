import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw, FileCheck } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans selection:bg-indigo-100 selection:text-indigo-800">
          <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/90 shadow-lg p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100">
              <AlertOctagon className="w-7 h-7" />
            </div>

            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white">
                <FileCheck className="w-3.5 h-3.5" />
              </div>
              <span className="text-base font-bold text-slate-900 font-display">
                Resume<span className="text-indigo-600">IQ</span>
              </span>
            </div>

            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2">
              Something went wrong
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              We encountered an unexpected error while rendering the application. Click the button below to reload and continue.
            </p>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-left mb-6 overflow-hidden">
                <p className="text-[11px] font-mono text-rose-700 break-words font-semibold">
                  {this.state.error.message || 'Unknown error'}
                </p>
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all cursor-pointer shadow-sm shadow-indigo-200"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reload ResumeIQ</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
