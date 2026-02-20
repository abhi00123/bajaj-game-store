import React from 'react';
import Card from '../../../components/ui/Card';
import { Clock } from 'lucide-react';

const CountdownTimer = ({ timeLeft, formatTime }) => {
    const isWarning = timeLeft <= 30;

    return (
        <div className="w-full mb-4">
            <div className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-300 bg-tetris-grid bg-opacity-95 shadow-lg backdrop-blur-md ${isWarning ? 'border-red-500 animate-pulse' : 'border-blue-500/30'}`}>
                <Clock className={`w-5 h-5 ${isWarning ? 'text-red-500' : 'text-blue-400'}`} />
                <span className={`text-2xl font-black tabular-nums ${isWarning ? 'text-red-500' : 'text-white'}`}>
                    {formatTime(timeLeft)}
                </span>
            </div>
        </div>
    );
};

export default CountdownTimer;
