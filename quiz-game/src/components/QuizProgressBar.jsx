import { motion } from 'framer-motion';

const QuizProgressBar = ({ currentQuestion, totalQuestions }) => {
    // Calculate percentage (currentQuestion is 1-indexed)
    const percentage = (currentQuestion / totalQuestions) * 100;

    // Calculate badge position - allow it to reach the edge (8% to 92%)
    const badgePosition = Math.max(8, Math.min(99, percentage));

    return (
        <div className="w-full px-2 pt-2 pb-4">
            {/* Main Progress Bar Container */}
            <div className="relative">
                {/* Outer border - dark blue solid */}
                <div
                    className="relative h-10 rounded-full p-1"
                    style={{
                        backgroundColor: '#1e3a8a',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 3px rgba(0, 0, 0, 0.2)'
                    }}
                >
                    {/* Inner track - dark blue */}
                    <div
                        className="relative h-full rounded-full overflow-hidden"
                        style={{ backgroundColor: '#1e3a8a' }}
                    >
                        {/* Progress fill - solid orange/coral */}
                        <motion.div
                            className="absolute left-0 top-0 h-full rounded-full"
                            style={{
                                backgroundColor: '#ff6b4a',
                                boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.2), inset 0 -2px 4px rgba(0, 0, 0, 0.1)'
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                        />
                    </div>
                </div>

                {/* Moving Badge - Question Counter (follows progress) */}
                <motion.div
                    className="absolute top-1/2"
                    initial={{ left: '8%' }}
                    animate={{ left: `${badgePosition}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    style={{ transform: 'translate(-50%, -50%)' }}
                >
                    <motion.div
                        className="flex items-center justify-center w-12 h-12 rounded-full text-white font-bold text-sm"
                        style={{
                            backgroundColor: '#1e3a8a',
                            border: '3px solid #fbbf24',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                        }}
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        key={currentQuestion}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        {currentQuestion}/{totalQuestions}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default QuizProgressBar;
