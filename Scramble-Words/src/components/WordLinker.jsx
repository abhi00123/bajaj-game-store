import { motion } from "framer-motion";

export default function WordLinker({ letters, usedIndices, hintedIndex, onLetterSelect }) {
    return (
        <div className="relative w-full max-w-[360px] min-h-[100px] flex flex-wrap justify-center gap-1.5 sm:gap-4 p-3 sm:p-5 bg-white/5 rounded-3xl backdrop-blur-sm border border-white/10 shadow-inner select-none">
            {letters.map((char, i) => {
                const isUsed = usedIndices.includes(i);
                const isHinted = hintedIndex === i;

                return (
                    <div key={`bank-${i}`} className="relative w-11 h-11 sm:w-16 sm:h-16">
                        {!isUsed && (
                            <motion.div
                                layout
                                layoutId={`letter-${i}`}
                                drag
                                dragConstraints={{ top: -500, bottom: 100, left: -200, right: 200 }}
                                dragElastic={0.1}
                                dragMomentum={false}
                                dragSnapToOrigin
                                onDragEnd={(e, info) => {
                                    // Robust detection: get all elements at point and find the box
                                    const elements = document.elementsFromPoint(info.point.x, info.point.y);
                                    const boxElement = elements.find(el => el.hasAttribute("data-box-index"));
                                    const boxIndex = boxElement ? parseInt(boxElement.getAttribute("data-box-index")) : null;

                                    if (boxIndex !== null) {
                                        onLetterSelect(i, boxIndex);
                                    } else if (info.offset.y < -40) {
                                        // Fallback to next empty if dragged up but not on a specific box
                                        onLetterSelect(i);
                                    }
                                }}
                                onTap={() => onLetterSelect(i)}
                                whileHover={{ scale: 1.05, zIndex: 30 }}
                                whileTap={{ scale: 0.95, zIndex: 30 }}
                                whileDrag={{ scale: 1.1, zIndex: 50 }}
                                className={`w-11 h-11 sm:w-16 sm:h-16 bg-white rounded-xl flex items-center justify-center font-game text-2xl sm:text-4xl text-blue-900 shadow-lg cursor-pointer z-20 transition-all duration-300
                                    ${isHinted ? 'hint-glow scale-110' : ''}
                                `}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                            >
                                {char}
                            </motion.div>
                        )}
                        {/* Placeholder for the letter to keep layout stable */}
                        <div className="absolute inset-0 bg-white/5 rounded-xl border-2 border-dotted border-white/20 -z-10" />
                    </div>
                );
            })}
        </div>
    );
}
