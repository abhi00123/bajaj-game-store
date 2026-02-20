import React, { Suspense, lazy } from 'react';
import './index.css';

const FinancialTetrisPage = lazy(() => import('./features/financialTetris/FinancialTetrisPage'));

function App() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-tetris-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <FinancialTetrisPage />
        </Suspense>
    );
}

export default App;
