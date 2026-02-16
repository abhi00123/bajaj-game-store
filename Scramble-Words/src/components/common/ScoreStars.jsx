import { Star } from "lucide-react";

export default function ScoreStars({ score }) {
    // Ensure score is within range [0, 5]
    const safeScore = Math.max(0, Math.min(score, 5));

    return (
        <div className="flex justify-center items-center gap-2">
            {[...Array(5)].map((_, index) => {
                const isFilled = index < safeScore;
                return (
                    <Star
                        key={index}
                        size={32}
                        className={`${isFilled
                                ? "fill-orange-500 text-orange-500"
                                : "text-gray-400"
                            }`}
                        // Use fill for filled stars, stroke for empty stars
                        fill={isFilled ? "currentColor" : "none"}
                        strokeWidth={isFilled ? 0 : 1.5}
                    />
                );
            })}
        </div>
    );
}
