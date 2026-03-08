import { useNavigate } from 'react-router-dom';
import FundriseShell from '../../../components/FundriseShell';
import { useFundrise } from '../../../contexts/FundriseContext';

const ArrowRight = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9,18 15,12 9,6" />
    </svg>
);

const DocIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8C8479" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14,2 14,8 20,8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10,9 9,9 8,9" />
    </svg>
);

export default function QuestionAccreditation() {
    const navigate = useNavigate();
    const { update } = useFundrise();

    const handleSelect = (val: boolean) => {
        update({ isAccredited: val });
        if (val) {
            navigate('/questions/qualified-purchaser');
        } else {
            navigate('/questions/hdyh');
        }
    };

    return (
        <FundriseShell
            onBack={() => navigate('/questions/satisfied-investment')}
            onClose={() => navigate('/')}
        >
            <div className="bg-white rounded-xl border border-[#EEE9E0] shadow-[0_2px_20px_rgba(21,21,19,0.06)] px-6 py-8 sm:px-10">
                <h1
                    className="text-[1.75rem] font-semibold text-[#151513] mb-2 leading-tight"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                    Are you an accredited investor?
                </h1>
                <p className="text-[14px] text-[#8C8479] mb-8 leading-relaxed">
                    By letting us know if you're accredited, you may gain access to additional investment opportunities.
                </p>

                {/* Options */}
                <div className="divide-y divide-[#F2F0EB] mb-6">
                    {[
                        { label: 'Yes', val: true },
                        { label: 'No', val: false },
                    ].map(({ label, val }) => (
                        <button
                            key={label}
                            onClick={() => handleSelect(val)}
                            className="w-full text-left flex items-center justify-between gap-4 py-4 group hover:bg-[#FDFCFA] -mx-1 px-1 rounded transition-colors"
                        >
                            <span className="text-[16px] text-[#151513] font-medium">{label}</span>
                            <span className="flex-shrink-0 text-[#C4BFB5] group-hover:text-[#AA4528] group-hover:translate-x-0.5 transition-all">
                                <ArrowRight />
                            </span>
                        </button>
                    ))}
                </div>

                {/* Info box */}
                <div className="bg-[#F7F5F0] rounded-lg p-4 border border-[#EEE9E0]">
                    <div className="flex gap-3">
                        <span className="mt-0.5 flex-shrink-0">
                            <DocIcon />
                        </span>
                        <div>
                            <p className="text-[13px] font-semibold text-[#151513] mb-1">Am I an accredited investor?</p>
                            <p className="text-[13px] text-[#5C564D] leading-relaxed mb-2">
                                Accreditation is an SEC-defined status based on wealth and income thresholds. Common qualifications include annual income in excess of $200,000 (or $300,000 joint income) for the last two years or household net worth in excess of $1 million, not including your primary residence.
                            </p>
                            <a
                                href="https://www.sec.gov/education/capitalraising/building-blocks/accredited-investor"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[13px] font-semibold text-[#AA4528] hover:text-[#8C3720] transition-colors"
                            >
                                See the full definition on sec.gov
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </FundriseShell>
    );
}
