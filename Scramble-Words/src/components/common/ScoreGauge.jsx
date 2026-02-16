import { motion } from "framer-motion";

export default function ScoreGauge({ score }) {
    // Ensure score is between 1 and 5
    const validScore = Math.min(Math.max(score, 1), 5);

    // Calculate needle rotation
    // Total range: -90deg (left) to 90deg (right) = 180 degrees
    // Each section is 36 degrees (180 / 5)
    // 1: -72
    // 2: -36
    // 3: 0
    // 4: 36
    // 5: 72
    const rotation = -90 + ((validScore - 1) * 36) + 18;

    return (
        <div className="relative w-full max-w-[280px] h-[150px] flex flex-col items-center justify-end mx-auto">
            <svg viewBox="0 0 220 120" className="w-full h-full overflow-visible">
                <defs>
                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#EF4444" /> {/* Red */}
                        <stop offset="25%" stopColor="#F97316" /> {/* Orange */}
                        <stop offset="50%" stopColor="#EAB308" /> {/* Yellow */}
                        <stop offset="75%" stopColor="#84CC16" /> {/* Light Green */}
                        <stop offset="100%" stopColor="#22C55E" /> {/* Green */}
                    </linearGradient>
                </defs>

                {/* Gauge Track Background */}
                <path
                    d="M 20 110 A 90 90 0 0 1 200 110"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="18"
                    strokeLinecap="round"
                />

                {/* Colored Gauge Arc */}
                <path
                    d="M 20 110 A 90 90 0 0 1 200 110"
                    fill="none"
                    stroke="url(#gaugeGradient)"
                    strokeWidth="18"
                    strokeLinecap="round"
                />

                {/* Ticks */}
                {Array.from({ length: 41 }).map((_, i) => {
                    const deg = -90 + (i * 4.5);
                    const rad = (deg * Math.PI) / 180;
                    const isMajor = i % 8 === 0;
                    const innerR = 75;
                    const outerR = isMajor ? 88 : 82;
                    const x1 = 110 + Math.cos(rad) * innerR;
                    const y1 = 110 + Math.sin(rad) * innerR;
                    const x2 = 110 + Math.cos(rad) * outerR;
                    const y2 = 110 + Math.sin(rad) * outerR;

                    return (
                        <line
                            key={i}
                            x1={x1} y1={y1} x2={x2} y2={y2}
                            stroke="rgba(255,255,255,0.4)"
                            strokeWidth={isMajor ? 2 : 1}
                        />
                    );
                })}

                {/* Needle - strictly using group transform for pivoting */}
                <g transform="translate(110, 110)">
                    <motion.g
                        initial={{ rotate: -90 }}
                        animate={{ rotate: rotation }}
                        transition={{ type: "spring", stiffness: 50, damping: 10 }}
                    >
                        {/* Needle body drawn relative to 0,0 center */}
                        <path d="M 0 0 L 0 -75" stroke="white" strokeWidth="4" strokeLinecap="round" />
                        <circle cx="0" cy="0" r="6" fill="white" />
                    </motion.g>
                </g>

                {/* Score Text */}
                <text
                    x="110"
                    y="70"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    className="text-4xl font-bold font-sans"
                    style={{ filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.5))' }}
                >
                    {validScore}/5
                </text>
            </svg>
        </div>
    );
}
