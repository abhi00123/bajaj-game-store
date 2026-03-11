import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { CATEGORY_CONFIG } from '../constants/categoryConfig';
import { isTubeSorted } from '../utils/tubeHelpers';

const TubeReportCard = ({ category, segments, capacity }) => {
    const config = CATEGORY_CONFIG[category];
    const isSorted = segments.length === capacity && isTubeSorted(segments, capacity);
    const isEmpty = segments.length === 0;
    const isMixed = !isSorted && !isEmpty;

    const statusBadge = isSorted ? '✓ Sorted' : isEmpty ? 'Empty' : '✗ Mixed';
    const statusBg = isSorted ? 'rgba(34,197,94,0.07)' : isMixed ? 'rgba(239,68,68,0.07)' : 'rgba(255,255,255,0.02)';
    const statusColor = isSorted ? '#22C55E' : isMixed ? '#EF4444' : 'rgba(255,255,255,0.3)';

    const insightHints = {
        growth: "Investments & Retirement need ring-fencing from liabilities to compound freely.",
        safety: "Emergency Fund & Fixed Income are your financial buffer — most commonly neglected.",
        resp: "Children's Education and Lifestyle goals are non-negotiable. Plan for them first.",
        risk: "Critical Illness, Term Life & Hospitalisation cover must be isolated — never mixed with growth.",
        asset: "Home / Car are real assets. Sorted here, they build long-term net worth clarity."
    };

    return (
        <div className="w-full p-4 rounded-2xl mb-3 border border-white/5 backdrop-blur-md" style={{ backgroundColor: statusBg }}>
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-xl">{config.icon}</span>
                    <span className="text-xs font-black tracking-widest" style={{ color: config.color }}>{config.label}</span>
                </div>
                <span className="text-[0.6rem] font-bold px-2 py-1 rounded-full border border-white/10" style={{ color: statusColor }}>
                    {statusBadge}
                </span>
            </div>

            <p className="text-[0.7rem] text-white/50 text-left mb-2">
                {isSorted ? `All ${segments.length} elements correctly sorted.` :
                    isMixed ? `Contains: ${segments.map(s => s.label).join(', ')}` :
                        "Nothing was placed here yet."}
            </p>

            {isMixed && (
                <div className="flex gap-2 p-2 bg-white/5 rounded-lg border border-white/5 mt-2">
                    <Info size={14} className="shrink-0 mt-0.5" style={{ color: config.color }} />
                    <p className="text-[0.6rem] text-left leading-relaxed italic" style={{ color: config.color }}>
                        {insightHints[category]}
                    </p>
                </div>
            )}
        </div>
    );
};

const LevelReport = ({ tubes, isWin, onNext, capacity }) => {
    const sortedTubesCount = tubes.filter(t => t.length === capacity && isTubeSorted(t, capacity)).length;
    const categoryMapping = ['growth', 'safety', 'resp', 'risk', 'asset'];

    // Header logic
    const sortedCountText = sortedTubesCount === 5 ? "5 of 5" : `${sortedTubesCount} of 5`;
    let icon = <CheckCircle2 className="text-green-500 w-12 h-12" />;
    let title = "Perfectly Sorted!";
    let subtitle = `You sorted ${sortedCountText} tubes correctly. Here's your full report.`;
    let iconBg = "bg-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.3)]";

    if (isWin) {
        if (sortedTubesCount === 5) {
            title = "Perfectly Sorted!";
        } else {
            title = `Level ${currentLevel || 1} Complete!`;
        }
    } else {
        icon = <AlertCircle className="text-red-500 w-12 h-12" />;
        iconBg = "bg-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.3)]";
        title = "Time's Up!";
        if (sortedTubesCount === 0) {
            subtitle = "No tubes fully sorted. In real life, unsorted finances work exactly the same way.";
        } else {
            subtitle = `You sorted ${sortedTubesCount} of 5 tubes. ${5 - sortedTubesCount} tube(s) were still mixed.`;
        }
    }

    return (
        <div className="flex flex-col items-center text-center max-w-sm mx-auto px-4 py-8 animate-fade-in">
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${iconBg}`}
            >
                {icon}
            </motion.div>

            <h2 className="text-3xl font-heading font-bold mb-2 text-white">{title}</h2>
            <p className="text-white/50 text-xs mb-8 leading-relaxed">{subtitle}</p>

            <div className="w-full mb-8 overflow-y-auto max-h-[50dvh] pr-1 custom-scrollbar">
                {categoryMapping.map((cat, idx) => (
                    <TubeReportCard
                        key={cat}
                        category={cat}
                        segments={tubes[idx]}
                        capacity={capacity}
                    />
                ))}
            </div>

            <Button fullWidth onClick={onNext} size="lg" className="bg-gold text-black font-black py-4 shadow-xl shadow-gold/20 hover:scale-[1.02] active:scale-95 transition-all">
                NEXT LEVEL
            </Button>
        </div>
    );
};

export default LevelReport;
