import { motion } from 'framer-motion';
import QuizProgressBar from './QuizProgressBar';
// Updated UI with enhanced option boxes and GST welcome image

const QuestionScreen = ({ question, currentQuestion, totalQuestions, onAnswerSelect, selectedAnswer }) => {

    return (
        <motion.div
            className="w-full h-full flex flex-col py-4 px-2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
        >
            {/* Quiz Progress Bar at Top */}
            <div className="mb-4">
                <QuizProgressBar currentQuestion={currentQuestion} totalQuestions={totalQuestions} />
            </div>

            <div className="flex-1 flex flex-col justify-start space-y-6">


                {/* Question Text Area */}
                <div className="bg-white border-l-8 border-brand-orange py-6 px-6">
                    <h2 className="text-xl sm:text-2xl font-black text-brand-blue leading-tight uppercase">
                        {question.question}
                    </h2>
                </div>

                {/* Options Area */}
                <div className="space-y-4">
                    {question.options.map((option, index) => (
                        <motion.button
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => onAnswerSelect(index)}
                            disabled={selectedAnswer !== null}
                            className={`w-full flex items-center group h-[100px] py-4 pr-6 pl-3 bg-brand-blue border-2 border-brand-blue transition-all ${selectedAnswer === index
                                ? 'ring-4 ring-white/50 ring-offset-2 ring-offset-brand-blue shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)]'
                                : 'shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] sm:hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] sm:hover:translate-x-[-2px] sm:hover:translate-y-[-2px]'
                                }`}
                        >
                            <span className={`
                                flex items-center justify-center w-12 h-12 mr-4 font-black border-2 text-xl transition-colors flex-shrink-0
                                ${selectedAnswer === index
                                    ? 'bg-white text-brand-blue border-white'
                                    : 'bg-white text-brand-blue border-white'}
                            `}>
                                {String.fromCharCode(65 + index)}
                            </span>
                            <span className="flex-1 text-left font-bold text-sm sm:text-base uppercase tracking-tight text-white line-clamp-2 overflow-hidden">{option}</span>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Bottom spacer for balance */}
            <div className="h-12 flex items-center justify-center">
                <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest text-center">
                    BAJAJ LIFE INSURANCE
                </p>
            </div>
        </motion.div>
    );
};

export default QuestionScreen;

