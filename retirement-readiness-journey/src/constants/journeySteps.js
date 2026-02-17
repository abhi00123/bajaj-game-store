export const JOURNEY_STEPS = {
    INTRO: 'intro',
    SCENARIO: 'scenario',
    LIFESTYLE: 'lifestyle',
    ESSENTIALS: 'essentials',
    ENGINE: 'engine',
    SURPRISES: 'surprises',
    RESULTS: 'results',
};

export const STEP_ORDER = [
    JOURNEY_STEPS.INTRO,
    JOURNEY_STEPS.SCENARIO,
    JOURNEY_STEPS.LIFESTYLE,
    JOURNEY_STEPS.ESSENTIALS,
    JOURNEY_STEPS.ENGINE,
    JOURNEY_STEPS.SURPRISES,
    JOURNEY_STEPS.RESULTS,
];

export const SCENARIO_OPTIONS = [
    { id: '5years', label: 'Within 5 Years', points: 20, icon: 'Clock' },
    { id: '10years', label: '10 Years Ready', points: 17, icon: 'Calendar' },
    { id: '15years', label: '15 Year Horizon', points: 14, icon: 'Compass' },
    { id: '20years', label: '20 Year Planning', points: 11, icon: 'Map' },
    { id: '25years', label: '25 Year Strategy', points: 8, icon: 'Search' },
    { id: '30years', label: '30+ Years Away', points: 5, icon: 'Star' },
];

export const LIFESTYLE_OPTIONS = [
    { id: 'simple', label: 'Simple', description: 'Essential needs and modest comfort.', points: 10, icon: 'Home' },
    { id: 'comfortable', label: 'Comfortable', description: 'Freedom to travel and enjoy hobbies.', points: 18, icon: 'Coffee' },
    { id: 'premium', label: 'Premium', description: 'Full luxury and legacy planning.', points: 25, icon: 'Crown' },
];

export const ESSENTIALS_OPTIONS = [
    { id: 'housing', label: 'Housing', points: 3 },
    { id: 'food', label: 'Food & Needs', points: 3 },
    { id: 'medical', label: 'Medical', points: 3 },
    { id: 'utilities', label: 'Utilities', points: 3 },
    { id: 'transport', label: 'Transportation', points: 3 },
];

export const ENGINE_OPTIONS = [
    { id: 'safety', label: 'Safety-Oriented', description: 'Bonds, Savings, Guaranteed Income', points: 8 },
    { id: 'growth', label: 'Growth-Oriented', description: 'Stocks, Real Estate, Diversified Portfolio', points: 9 },
    { id: 'income', label: 'Income-Oriented', description: 'Dividends, Annuities, Rental Income', points: 8 },
];

export const SURPRISE_CATEGORIES = [
    {
        id: 'medical',
        label: 'Medical Crisis',
        options: [
            { id: 'medical_strong', label: 'Strong', subLabel: 'Comprehensive Coverage', points: 5 },
            { id: 'medical_weak', label: 'Weak', subLabel: 'Basic Protection', points: 2 },
        ]
    },
    {
        id: 'inflation',
        label: 'Living Cost Inflation',
        options: [
            { id: 'inflation_strong', label: 'Strong', subLabel: 'Inflation-Adjusted', points: 5 },
            { id: 'inflation_weak', label: 'Weak', subLabel: 'Fixed Income', points: 2 },
        ]
    },
    {
        id: 'longevity',
        label: 'Longer Life',
        options: [
            { id: 'longevity_strong', label: 'Strong', subLabel: 'Multi-Generational', points: 5 },
            { id: 'longevity_weak', label: 'Weak', subLabel: 'Standard Lifespan', points: 2 },
        ]
    }
];

export const READINESS_BANDS = [
    { min: 85, max: 100, label: 'CHAMPION', description: 'You are exceptionally prepared for a secure and thriving retirement.', color: 'emerald' },
    { min: 70, max: 84, label: 'STRATEGIST', description: 'You have a solid foundation but may need minor adjustments to reach the peak.', color: 'blue' },
    { min: 50, max: 69, label: 'PLANNER', description: 'You are on the right track, but significant gaps still need to be addressed.', color: 'blue' },
    { min: 30, max: 49, label: 'STARTER', description: 'You have begun the journey, but a more aggressive strategy is required.', color: 'orange' },
    { min: 0, max: 29, label: 'JUST BEGINNING', description: 'It is time to take serious action to ensure your financial future.', color: 'orange' },
];
