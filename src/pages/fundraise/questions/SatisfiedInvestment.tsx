import { useNavigate } from 'react-router-dom';
import FundriseShell from '../../../components/FundriseShell';
import { useFundrise } from '../../../contexts/FundriseContext';

const ArrowRight = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9,18 15,12 9,6" />
    </svg>
);

const YEARLY_OPTIONS = [
    'Less than $1,000',
    '$1,000 to $10,000',
    '$10,000 to $25,000',
    '$25,000 to $100,000',
    '$100,000 to $1,000,000',
    'More than $1,000,000',
];

export default function QuestionSatisfiedInvestment() {
    const navigate = useNavigate();
    const { update } = useFundrise();

    const handleSelect = (value: string) => {
        update({ yearlyInvestment: value });
        navigate('/questions/accreditation');
    };

    return (
        <FundriseShell
            onBack={() => navigate('/questions/income-v2')}
            onClose={() => navigate('/')}
        >
            <div className="bg-white rounded-xl border border-[#EEE9E0] shadow-[0_2px_20px_rgba(21,21,19,0.06)] px-6 py-8 sm:px-10">
                <h1
                    className="text-[1.75rem] font-semibold text-[#151513] mb-2 leading-tight"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                    How much could you invest with Hushh every year?
                </h1>
                <p className="text-[14px] text-[#8C8479] mb-8 leading-relaxed">
                    Please answer this question assuming you were{' '}
                    <em className="not-italic font-semibold">completely satisfied</em> with your Hushh investment experience.
                </p>

                <div className="divide-y divide-[#F2F0EB]">
                    {YEARLY_OPTIONS.map(opt => (
                        <button
                            key={opt}
                            onClick={() => handleSelect(opt)}
                            className="w-full text-left flex items-center justify-between gap-4 py-4 group hover:bg-[#FDFCFA] -mx-1 px-1 rounded transition-colors"
                        >
                            <span className="text-[16px] text-[#151513] font-medium">{opt}</span>
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
