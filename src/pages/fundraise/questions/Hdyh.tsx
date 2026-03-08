import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FundriseShell from '../../../components/FundriseShell';
import { useFundrise } from '../../../contexts/FundriseContext';

const HDYH_OPTIONS = [
    'Podcast',
    'YouTube',
    'Website, Blog or Article',
    'Social Media Ad',
    'Yahoo Finance',
    'AI Tool (e.g. ChatGPT)',
    'The Penny Hoarder',
    'Family or Friend',
    'TV or Radio',
    'Social Media Influencer',
    'Other',
];

export default function QuestionHdyh() {
    const navigate = useNavigate();
    const { update } = useFundrise();
    const [selected, setSelected] = useState<string | null>(null);

    const handleContinue = () => {
        if (!selected) return;
        update({ hdyhSource: selected });
        navigate('/reits/checkout/investment-recommendation');
    };

    const handleSkip = () => {
        navigate('/reits/checkout/investment-recommendation');
    };

    return (
        <FundriseShell
            onBack={() => navigate(-1 as any)}
            onClose={() => navigate('/')}
        >
            <div className="bg-white rounded-xl border border-[#EEE9E0] shadow-[0_2px_20px_rgba(21,21,19,0.06)] px-6 py-8 sm:px-10">
                <h1
                    className="text-[1.75rem] font-semibold text-[#151513] mb-8 leading-tight"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                    How did you hear about Hushh?
                </h1>

                {/* Radio list */}
                <div className="divide-y divide-[#F2F0EB] mb-8">
                    {HDYH_OPTIONS.map(opt => {
                        const isSelected = selected === opt;
                        return (
                            <button
                                key={opt}
                                onClick={() => setSelected(opt)}
                                className="w-full flex items-center justify-between py-3.5 gap-4 group -mx-1 px-1 rounded hover:bg-[#FDFCFA] transition-colors"
                            >
                                <span
                                    className={`text-[15px] font-medium ${isSelected ? 'text-[#AA4528]' : 'text-[#151513]'}`}
                                >
                                    {opt}
                                </span>
                                {/* Radio circle */}
                                <div
                                    className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-[#AA4528]' : 'border-[#C4BFB5]'
                                        }`}
                                >
                                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#AA4528]" />}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Continue button */}
                <button
                    onClick={handleContinue}
                    disabled={!selected}
                    className={`w-full py-4 rounded-lg text-[15px] font-semibold transition-all mb-3 ${selected
                            ? 'bg-[#AA4528] text-white hover:bg-[#8C3720] active:scale-[0.99]'
                            : 'bg-[#EEE9E0] text-[#C4BFB5] cursor-not-allowed'
                        }`}
                >
                    Continue
                </button>

                {/* Skip */}
                <button
                    onClick={handleSkip}
                    className="w-full py-3 text-center text-[14px] font-semibold text-[#151513] border border-[#EEE9E0] rounded-lg hover:bg-[#F7F5F0] transition-colors"
                >
                    Skip
                </button>
            </div>
        </FundriseShell>
    );
}
