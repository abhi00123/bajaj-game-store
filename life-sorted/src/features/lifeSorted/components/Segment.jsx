import React from 'react';
import { motion } from 'framer-motion';

const Segment = ({
    element,
    isBottom,
    heightPct = 25
}) => {
    return (
        <motion.div
            layout
            className={`relative w-full flex-shrink-0 flex items-center justify-center
                ${isBottom ? 'rounded-b-[2rem]' : 'rounded-none'}
            `}
            style={{
                backgroundColor: element.color,
                height: `${heightPct}%`,
                marginBottom: '-1px'
            }}
        >
            <span className="relative z-10 text-sm sm:text-lg select-none flex items-center justify-center">
                {element.emoji}
            </span>
        </motion.div>
    );
};

export default Segment;
