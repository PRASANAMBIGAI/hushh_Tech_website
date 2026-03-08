import { useNavigate } from 'react-router-dom';
import FundriseShell from '../../../components/FundriseShell';
import { useFundrise } from '../../../contexts/FundriseContext';

const ArrowRight = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9,18 15,12 9,6" />
    </svg>
);

type Plan = 'supplemental_income' | 'balanced_investing' | 'long_term_growth';

const PLANS: { id: Plan; label: string; description: string }[] = [
    {
        id: 'supplemental_income',
        label: 'Supplemental Income',
        description: 'Target consistent returns in the form of income over the short-term, but with a lower total potential return over the life of the investment.',
    },
    {
        id: 'balanced_investing',
        label: 'Balanced Investing',
        description: 'Build wealth confidently with increased diversification. This plan is weighted relatively evenly across income and growth-oriented assets.',
    },
    {
        id: 'long_term_growth',
        label: 'Long-term Growth',
        description: 'Pursue superior overall returns over the long term. This plan is weighted toward assets that have a high potential to appreciate in value.',
    },
];

export default function SelectFundInvestmentList() {
    const navigate = useNavigate();
    const { update } = useFundrise();

    const handleSelect = (plan: Plan) => {
        update({ selectedPlan: plan });
        navigate('/reits/checkout/select-fund-investment-detail');
    };

    return (
        <FundriseShell onClose={() => navigate('/')}>
            <div className="bg-white rounded-xl border border-[#EEE9E0] shadow-[0_2px_20px_rgba(21,21,19,0.06)] px-6 py-8 sm:px-10">
                <h1
                    className="text-[1.75rem] font-semibold text-[#151513] mb-2 leading-tight"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                    Please make your selection
                </h1>
                <p className="text-[14px] text-[#8C8479] mb-8">
                    Find an option that best suits your needs. You can change this later at any time.
                </p>

                <div className="divide-y divide-[#F2F0EB]">
                    {PLANS.map(plan => (
                        <button
                            key={plan.id}
                            onClick={() => handleSelect(plan.id)}
                            className="w-full text-left flex items-center justify-between gap-4 py-5 group hover:bg-[#FDFCFA] -mx-1 px-1 rounded transition-colors"
                        >
                            <div className="flex-1">
                                <p className="text-[16px] font-semibold text-[#151513] mb-1">{plan.label}</p>
                                <p className="text-[13px] text-[#8C8479] leading-relaxed">{plan.description}</p>
                            </div>
                            <span className="flex-shrink-0 text-[#C4BFB5] group-hover:text-[#AA4528] group-hover:translate-x-0.5 transition-all">
                                <ArrowRight />
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </FundriseShell>
    );
}
