import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FundriseShell from '../../../components/FundriseShell';
import { useFundrise } from '../../../contexts/FundriseContext';

// Simple donut chart component
const DonutChart = ({ segments }: { segments: { pct: number; color: string }[] }) => {
    const r = 42;
    const cx = 50;
    const cy = 50;
    const circumference = 2 * Math.PI * r;
    let cumulativePct = 0;

    return (
        <svg width="120" height="120" viewBox="0 0 100 100" className="rotate-[-90deg]">
            {segments.map((seg, i) => {
                const dash = (seg.pct / 100) * circumference;
                const offset = -(cumulativePct / 100) * circumference;
                cumulativePct += seg.pct;
                return (
                    <circle
                        key={i}
                        cx={cx}
                        cy={cy}
                        r={r}
                        fill="none"
                        stroke={seg.color}
                        strokeWidth="14"
                        strokeDasharray={`${dash} ${circumference - dash}`}
                        strokeDashoffset={offset}
                    />
                );
            })}
        </svg>
    );
};

const ArrowRight = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9,18 15,12 9,6" />
    </svg>
);

type Plan = 'supplemental_income' | 'balanced_investing' | 'long_term_growth';

const PLANS: { id: Plan; label: string; description: string; segments: { pct: number; color: string }[] }[] = [
    {
        id: 'long_term_growth',
        label: 'Long-term Growth',
        description: 'Pursue superior overall returns over the long term, with assets that have a high potential to appreciate in value.',
        segments: [{ pct: 90, color: '#8BAAB5' }, { pct: 10, color: '#2D4A5A' }],
    },
    {
        id: 'supplemental_income',
        label: 'Supplemental Income',
        description: 'Target consistent returns in the form of income over the short-term, but with a lower total potential return over the life of the investment.',
        segments: [{ pct: 20, color: '#8BAAB5' }, { pct: 80, color: '#2D4A5A' }],
    },
    {
        id: 'balanced_investing',
        label: 'Balanced Investing',
        description: 'Build wealth confidently with increased diversification. This plan is weighted relatively evenly across income and growth-oriented assets.',
        segments: [{ pct: 50, color: '#8BAAB5' }, { pct: 50, color: '#2D4A5A' }],
    },
];

const BEST_FOR: Record<Plan, { heading: string; desc: string }[]> = {
    long_term_growth: [
        { heading: 'Investors seeking long-term, risk-adjusted returns', desc: 'For those who are okay with their portfolio fluctuating up and down in the short-term, as they\'re primarily focused on the best risk-adjusted returns over the long-term.' },
        { heading: 'Investors seeking diversification and performance', desc: 'For those interested in gaining access to alternative investments and diversifying outside just the stock market, in an effort to earn better long-term returns.' },
    ],
    supplemental_income: [
        { heading: 'Investors who are currently retired or nearing retirement', desc: 'As this portfolio is focused on generating current income, it\'s likely the best fit for someone who wants to increase their current cash flow today (as opposed to in the future).' },
        { heading: 'Investors interested in consistent dividend payments', desc: 'This portfolio is focused on generating consistent returns with low volatility, even at the expense of the highest potential long-term returns.' },
    ],
    balanced_investing: [
        { heading: 'Investors looking for a middle ground', desc: 'This plan balances both income and growth objectives, making it suitable for investors who want diversification without fully committing to either end of the spectrum.' },
        { heading: 'Investors with a medium-term horizon', desc: 'For those who have a 3-7 year investment timeline and want moderate growth with moderate income distributions.' },
    ],
};

const ALLOCATION_LABELS: Record<Plan, { label: string; pct: number; color: string }[]> = {
    long_term_growth: [
        { label: 'Real estate', pct: 90, color: '#8BAAB5' },
        { label: 'Private credit', pct: 10, color: '#2D4A5A' },
    ],
    supplemental_income: [
        { label: 'Private credit', pct: 80, color: '#2D4A5A' },
        { label: 'Real estate', pct: 20, color: '#8BAAB5' },
    ],
    balanced_investing: [
        { label: 'Real estate', pct: 50, color: '#8BAAB5' },
        { label: 'Private credit', pct: 50, color: '#2D4A5A' },
    ],
};

export default function InvestmentRecommendation() {
    const navigate = useNavigate();
    const { state, update } = useFundrise();
    // Default recommended plan - derive from user answers
    const defaultPlan: Plan =
        state.portfolioGoal === 'short_term' || state.primaryGoal === 'fixed_income'
            ? 'supplemental_income'
            : 'long_term_growth';

    const recommended = PLANS.find(p => p.id === defaultPlan) || PLANS[0];
    const otherPlans = PLANS.filter(p => p.id !== recommended.id);

    const [activeTab, setActiveTab] = useState<'best_for' | 'strategy' | 'asset_classes'>('best_for');

    const handleSelect = (plan: Plan) => {
        update({ selectedPlan: plan });
        navigate('/info/personal-details');
    };

    const bestFor = BEST_FOR[recommended.id];
    const alloc = ALLOCATION_LABELS[recommended.id];

    return (
        <FundriseShell onClose={() => navigate('/')}>
            <div className="space-y-6">
                {/* Header text */}
                <p className="text-[14px] text-[#5C564D]">Based on your answers, here's our recommendation for you:</p>

                {/* Recommended plan card */}
                <div className="bg-white rounded-xl border border-[#EEE9E0] shadow-[0_2px_20px_rgba(21,21,19,0.06)] p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                            <h1
                                className="text-[1.6rem] font-semibold text-[#151513] leading-tight mb-2"
                                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                            >
                                {recommended.label}
                            </h1>
                            <p className="text-[14px] text-[#AA4528] leading-relaxed">{recommended.description}</p>
                        </div>
                        <button
                            onClick={() => handleSelect(recommended.id)}
                            className="flex-shrink-0 bg-[#AA4528] text-white px-5 py-2.5 rounded-lg text-[14px] font-semibold hover:bg-[#8C3720] transition-colors"
                        >
                            Select
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-5">
                        {(['best_for', 'strategy', 'asset_classes'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-colors ${activeTab === tab
                                        ? 'bg-[#151513] text-white'
                                        : 'bg-[#F2F0EB] text-[#5C564D] hover:bg-[#EEE9E0]'
                                    }`}
                            >
                                {tab === 'best_for' ? 'Best for' : tab === 'strategy' ? 'Strategy' : 'Asset classes'}
                            </button>
                        ))}
                    </div>

                    {/* Content + Donut */}
                    <div className="flex gap-6 items-start">
                        <div className="flex-1">
                            {activeTab === 'best_for' && bestFor.map((item, i) => (
                                <div key={i} className="mb-4">
                                    <p className="text-[14px] font-semibold text-[#151513] mb-1">{item.heading}</p>
                                    <p className="text-[13px] text-[#AA4528] leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                            {activeTab === 'strategy' && (
                                <p className="text-[13px] text-[#5C564D] leading-relaxed">
                                    This portfolio strategy focuses on allocating across private real estate equity and private credit instruments, optimized for {recommended.label.toLowerCase()} performance.
                                </p>
                            )}
                            {activeTab === 'asset_classes' && (
                                <div className="space-y-2">
                                    {alloc.map(a => (
                                        <div key={a.label} className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: a.color }} />
                                            <span className="text-[13px] text-[#5C564D]">{a.label}</span>
                                            <span className="text-[13px] font-semibold text-[#151513] ml-auto">{a.pct}%</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* Donut */}
                        <div className="flex-shrink-0">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8C8479] mb-2 text-center">Current Allocation</p>
                            <DonutChart segments={recommended.segments} />
                            <div className="mt-2 space-y-1">
                                {alloc.map(a => (
                                    <div key={a.label} className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: a.color }} />
                                        <span className="text-[11px] text-[#5C564D]">{a.label}</span>
                                        <span className="text-[11px] font-semibold text-[#151513] ml-auto">{a.pct}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* All other plans */}
                <div>
                    <h2 className="text-[17px] font-semibold text-[#151513] mb-1">All other plans</h2>
                    <p className="text-[13px] text-[#8C8479] mb-4">You can change your plan anytime</p>
                    <div className="space-y-3">
                        {otherPlans.map(plan => (
                            <button
                                key={plan.id}
                                onClick={() => handleSelect(plan.id)}
                                className="w-full bg-white rounded-xl border border-[#EEE9E0] p-5 text-left flex items-center justify-between gap-4 hover:border-[#AA4528]/30 hover:bg-[#FDF9F7] transition-all group"
                            >
                                <div>
                                    <p className="text-[15px] font-semibold text-[#151513] mb-1">{plan.label}</p>
                                    <p className="text-[13px] text-[#AA4528] leading-relaxed">{plan.description}</p>
                                </div>
                                <span className="flex-shrink-0 text-[#C4BFB5] group-hover:text-[#AA4528] group-hover:translate-x-0.5 transition-all">
                                    <ArrowRight />
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </FundriseShell>
    );
}
