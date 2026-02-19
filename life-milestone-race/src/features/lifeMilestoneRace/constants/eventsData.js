/**
 * Events data for the Life Milestone Race.
 * Each stage has exactly 5 events.
 *
 * Scoring: +10 protected / -10 exposed (flat, no compounding).
 * Starting score: 50/100.
 *
 * Severity is visual only (for impact badge styling).
 *   high   → "High Impact" (orange badge)
 *   medium → "Medium Impact" (blue badge)
 */

const EVENTS = [
    // ───────────────────────── First Job (22–25) ─────────────────────────
    {
        id: 'fj-01',
        stage: 'first-job',
        title: 'Medical Emergency & Hospitalization',
        severity: 'high',
        description: 'Sudden illness requires hospitalization. Employer cover is minimal or absent.',
        impactProtected: 10,
        impactExposed: -10,
        icon: '🏥'
    },
    {
        id: 'fj-02',
        stage: 'first-job',
        title: 'Job Loss or Income Interruption',
        severity: 'high',
        description: 'Unexpected job loss. EMIs and monthly expenses continue but income stops.',
        impactProtected: 10,
        impactExposed: -10,
        icon: '⚠️'
    },
    {
        id: 'fj-03',
        stage: 'first-job',
        title: 'Family Dependency - Death of Earning Member',
        severity: 'high',
        description: 'Loss of parent impacts family. Your income becomes critical for family support.',
        impactProtected: 10,
        impactExposed: -10,
        icon: '👴'
    },
    {
        id: 'fj-04',
        stage: 'first-job',
        title: 'Temporary Disability Due to Accident',
        severity: 'high',
        description: 'Accident leaves you temporarily unable to work. Income loss for weeks/months.',
        impactProtected: 10,
        impactExposed: -10,
        icon: '🚑'
    },
    {
        id: 'fj-05',
        stage: 'first-job',
        title: 'Down Payment for Dream Home',
        severity: 'medium',
        description: 'Need to save for home down payment while managing monthly expenses.',
        impactProtected: 10,
        impactExposed: -10,
        icon: '🏠'
    },

    // ───────────────────────── Marriage (25–30) ─────────────────────────
    {
        id: 'mr-01',
        stage: 'marriage',
        title: 'Medical Emergency of One Spouse',
        severity: 'high',
        description: 'Spouse hospitalized with high medical bills. Employer cover is limited.',
        impactProtected: 10,
        impactExposed: -10,
        icon: '🏥'
    },
    {
        id: 'mr-02',
        stage: 'marriage',
        title: 'Accidental Death of One Spouse',
        severity: 'high',
        description: 'Loss of spouse disrupts lifestyle and creates financial liabilities.',
        impactProtected: 10,
        impactExposed: -10,
        icon: '⚠️'
    },
    {
        id: 'mr-03',
        stage: 'marriage',
        title: 'Critical Illness of Earning Spouse',
        severity: 'high',
        description: 'Cancer, heart disease diagnosed. Treatment costs + recovery period affects income.',
        impactProtected: 10,
        impactExposed: -10,
        icon: '💊'
    },
    {
        id: 'mr-04',
        stage: 'marriage',
        title: 'Job Loss of One Spouse',
        severity: 'high',
        description: 'One spouse loses job. Household depends entirely on one income.',
        impactProtected: 10,
        impactExposed: -10,
        icon: '📉'
    },
    {
        id: 'mr-05',
        stage: 'marriage',
        title: 'Disability Due to Accident',
        severity: 'high',
        description: 'Accident disables spouse long-term. Medical care + lost income creates crisis.',
        impactProtected: 10,
        impactExposed: -10,
        icon: '🚑'
    },

    // ───────────────────────── Parenthood (30–35) ─────────────────────────
    {
        id: 'ph-01',
        stage: 'parenthood',
        title: 'Child Education Needs',
        severity: 'medium',
        description: 'Need funds for school admission, board, and ongoing education costs.',
        impactProtected: 10,
        impactExposed: -10,
        icon: '🎓'
    },
    {
        id: 'ph-02',
        stage: 'parenthood',
        title: 'Death of Earning Parent',
        severity: 'high',
        description: "Loss of parent threatens child's education and family's future security.",
        impactProtected: 10,
        impactExposed: -10,
        icon: '⚠️'
    },
    {
        id: 'ph-03',
        stage: 'parenthood',
        title: 'Medical Emergency - Self/Spouse/Child',
        severity: 'high',
        description: 'Health crisis in family. High hospitalization costs and time off work.',
        impactProtected: 10,
        impactExposed: -10,
        icon: '🏥'
    },
    {
        id: 'ph-04',
        stage: 'parenthood',
        title: 'Critical Illness of Earning Parent',
        severity: 'high',
        description: 'Cancer, heart disease diagnosed. Goals and income both at risk.',
        impactProtected: 10,
        impactExposed: -10,
        icon: '💊'
    },
    {
        id: 'ph-05',
        stage: 'parenthood',
        title: 'Permanent Disability Due to Accident',
        severity: 'high',
        description: "Accident causes long-term disability. Family's future income security threatened.",
        impactProtected: 10,
        impactExposed: -10,
        icon: '🚑'
    },

    // ───────────────────────── Mid-Career (35–50) ─────────────────────────
    {
        id: 'mc-01',
        stage: 'mid-career',
        title: 'Job Loss or Business Income Disruption',
        severity: 'high',
        description: 'Sudden job loss or business crisis. Re-employment risk is high in competitive market.',
        impactProtected: 10,
        impactExposed: -10,
        icon: '📉'
    },
    {
        id: 'mc-02',
        stage: 'mid-career',
        title: 'Parental Care Needs',
        severity: 'high',
        description: 'Parent requires medical care and financial support. Ongoing expenses and time commitment.',
        impactProtected: 10,
        impactExposed: -10,
        icon: '👴'
    },
    {
        id: 'mc-03',
        stage: 'mid-career',
        title: 'Critical Illness - Peak Risk Phase',
        severity: 'high',
        description: 'Cancer, heart disease, stroke diagnosed. High treatment costs and long recovery.',
        impactProtected: 10,
        impactExposed: -10,
        icon: '💊'
    },
    {
        id: 'mc-04',
        stage: 'mid-career',
        title: 'Death of Earning Member',
        severity: 'high',
        description: 'Loss of you exposes multiple dependents and liabilities. Family lifestyle disrupted.',
        impactProtected: 10,
        impactExposed: -10,
        icon: '⚠️'
    },
    {
        id: 'mc-05',
        stage: 'mid-career',
        title: 'Investment Loss - Market Downturn',
        severity: 'medium',
        description: 'Market crash affects investments. Retirement plans delayed.',
        impactProtected: 10,
        impactExposed: -10,
        icon: '📊'
    },

    // ───────────────────────── Approaching Retirement (55–60) ─────────────────────────
    {
        id: 'rt-01',
        stage: 'retirement',
        title: 'Loss of Regular Income',
        severity: 'high',
        description: 'Retirement means end of regular salary. Income sources become critical.',
        impactProtected: 10,
        impactExposed: -10,
        icon: '📊'
    },
    {
        id: 'rt-02',
        stage: 'retirement',
        title: 'Longevity Risk - Outliving Savings',
        severity: 'high',
        description: 'Living longer than planned. Savings need to last 30-40 years in retirement.',
        impactProtected: 10,
        impactExposed: -10,
        icon: '📅'
    },
    {
        id: 'rt-03',
        stage: 'retirement',
        title: 'Healthcare Inflation',
        severity: 'high',
        description: 'Medical costs rise faster than expected. Inflation erodes purchasing power.',
        impactProtected: 10,
        impactExposed: -10,
        icon: '💊'
    },
    {
        id: 'rt-04',
        stage: 'retirement',
        title: 'Legacy Planning - Inheritance Needs',
        severity: 'medium',
        description: 'Need to leave inheritance for family. Estate planning becomes critical.',
        impactProtected: 10,
        impactExposed: -10,
        icon: '🏠'
    },
    {
        id: 'rt-05',
        stage: 'retirement',
        title: 'Critical Health Crisis in Retirement',
        severity: 'high',
        description: 'Major health issue in retirement. No employer cover. High out-of-pocket costs.',
        impactProtected: 10,
        impactExposed: -10,
        icon: '🏥'
    },
];

export default EVENTS;
