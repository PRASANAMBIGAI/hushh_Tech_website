import { useNavigate } from 'react-router-dom';
import FundriseShell from '../../../components/FundriseShell';
import { useFundrise } from '../../../contexts/FundriseContext';

const ArrowRight = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9,18 15,12 9,6" />
    </svg>
);

const options = [
    {
        id: 'diversification',
        label: 'Diversification & performance',
        description: "I'm interested in gaining access to alternative investments and diversifying outside just the stock market, in an effort to earn better long-term returns.",
    },
    {
        id: 'fixed_income',
        label: 'Consistent fixed income',
        description: "I'm interested in investments that deliver lower-return but consistent fixed income distributions (often best for those who are retired).",
    },
] as const;

export default function QuestionMotivation() {
    const navigate = useNavigate();
    const { update } = useFundrise();

    const handleSelect = (val: 'diversification' | 'fixed_income') => {
        update({ primaryGoal: val });
        navigate('/questions/income-v2');
    };

    return (
        <FundriseShell
            onBack={() => navigate('/questions/success')}
            onClose={() => navigate('/')}
        >
            <div className="bg-white rounded-xl border border-[#EEE9E0] shadow-[0_2px_20px_rgba(21,21,19,0.06)] px-6 py-8 sm:px-10">
                <h1
                    className="text-[1.75rem] font-semibold text-[#151513] mb-2 leading-tight"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                    What's your primary goal with Hushh?
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
