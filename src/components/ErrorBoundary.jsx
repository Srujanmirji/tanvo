import { Component } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

/**
 * Catches render errors so a single broken component degrades to a
 * recoverable message instead of a blank white page.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Replace with your error reporter (Sentry, etc.) when you add one.
    console.error('Unhandled render error:', error, info?.componentStack);
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    const { children, label = 'this section' } = this.props;

    if (!error) return children;

    return (
      <div
        role="alert"
        className="glass-card mx-auto my-12 max-w-lg p-8 text-center flex flex-col items-center gap-4"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400">
          <AlertTriangle size={22} aria-hidden="true" />
        </div>
        <div>
          <h2 className="mb-2 font-heading text-xl font-bold text-white">
            Something broke in {label}
          </h2>
          <p className="text-sm leading-relaxed text-slate-400">
            The rest of the page is still fine. Try again, or reload if it keeps
            happening.
          </p>
        </div>
        <button type="button" onClick={this.handleReset} className="btn-secondary mt-2">
          <RotateCcw size={16} aria-hidden="true" /> Try again
        </button>
      </div>
    );
  }
}
