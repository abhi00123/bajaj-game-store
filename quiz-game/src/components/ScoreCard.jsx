

const ScoreCard = ({ score, total }) => {
    return (
        <div className="flex justify-center items-center py-4">
            <div className="relative flex flex-col items-center justify-center w-32 h-32 rounded-full border-4 border-brand-orange bg-brand-blue shadow-[0px_0px_20px_rgba(194,65,12,0.3)]">
                <div className="uppercase tracking-[0.1em] text-[10px] font-black opacity-80 text-white mb-1">
                    Your Score
                </div>
                <div className="flex items-baseline justify-center text-white gap-0.5">
                    <span className="text-4xl font-black leading-none">{score}</span>
                    <span className="text-2xl font-bold opacity-70">/{total}</span>
                </div>
            </div>
        </div>
    );
};

export default ScoreCard;
