import { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Global error boundary — catches rendering errors and shows a recovery UI.
 */
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    handleReset() {
        this.setState({ hasError: false, error: null });
        window.location.href = '/';
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="vh-fix flex items-center justify-center bg-sudoku-bg px-4">
                    <div className="card p-6 max-w-sm w-full text-center">
                        <div className="text-[3rem] mb-3">⚠️</div>
                        <h2 className="font-display text-[1.25rem] font-bold text-sudoku-danger mb-2">
                            Something went wrong
                        </h2>
                        <p className="text-sudoku-muted text-[0.85rem] mb-5">
                            An unexpected error occurred. Please refresh and try again.
                        </p>
                        <button
                            onClick={() => this.handleReset()}
                            className="btn-primary w-full"
                        >
                            🔄 Restart Game
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
