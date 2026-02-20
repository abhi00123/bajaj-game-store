import { Suspense, lazy } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './index.css';

const AppRouter = lazy(() => import('./routes/AppRouter.jsx'));

function LoadingFallback() {
    return (
        <div className="vh-fix w-full flex items-center justify-center bg-sudoku-bg">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-2 border-sudoku-accent border-t-transparent rounded-full animate-spin" />
                <span className="text-sudoku-muted text-[0.875rem] font-body">Loading Retirement Sudoku...</span>
            </div>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
                <AppRouter />
            </Suspense>
        </BrowserRouter>
    );
}

export default App;
