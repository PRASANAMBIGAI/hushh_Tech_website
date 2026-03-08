import { useNavigate } from 'react-router-dom';
import FundriseShell from '../../../components/FundriseShell';
import { useFundrise } from '../../../contexts/FundriseContext';

// Arrow right icon
const ArrowRight = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9,18 15,12 9,6" />
    </svg>
);

const options = [
    {
        id: 'long_term',
        label: 'Long-term, risk-adjusted returns',
        description: "I'm okay with my portfolio fluctuating up and down in the short-term, as I'm primarily focused on the best risk-adjusted returns over the long-term.",
    },
    {
        id: 'short_term',
        label: 'Short-term, consistent returns',
        description: "I'm primarily focused on consistent returns with low volatility. I prefer reliable short-term returns even at the cost of the highest potential long-term return.",
    },
] as const;

export default function QuestionSuccess() {
    const navigate = useNavigate();
    const { update } = useFundrise();

    const handleSelect = (val: 'long_term' | 'short_term') => {
        update({ portfolioGoal: val });
        navigate('/questions/motivation');
    };

    return (
        <FundriseShell
            onBack={() => navigate('/questions/intro')}
            onClose={() => navigate('/')}
        >
            <div className="bg-white rounded-xl border border-[#EEE9E0] shadow-[0_2px_20px_rgba(21,21,19,0.06)] px-6 py-8 sm:px-10">
                <h1
                    className="text-[1.75rem] font-semibold text-[#151513] mb-2 leading-tight"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                    What's most important to you in your portfolio?
                </h1>
                <p className="text-[14px] text-[#8C8479] mb-8">Select the option that best describes you.</p>

                <div className="divide-y divide-[#F2F0EB]">
                    {options.map(opt => (
                        <button
                            key={opt.id}
                            onClick={() => handleSelect(opt.id)}
                            className="w-full text-left flex items-center justify-between gap-4 py-5 group hover:bg-[#FDFCFA] -mx-1 px-1 rounded transition-colors"
                        >
                            <div className="flex-1">
                                <p className="text-[16px] font-semibold text-[#151513] mb-1">{opt.label}</p>
                                <p className="text-[14px] text-[#8C8479] leading-relaxed">{opt.description}</p>
                            </div>
                            <span className="flex-shrink-0 text-[#8C8479] group-hover:text-[#AA4528] group-hover:translate-x-0.5 transition-all">
                                <ArrowRight />
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </FundriseShell>
    );
}
