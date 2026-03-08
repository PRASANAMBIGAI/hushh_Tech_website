import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FundriseShell from '../../../components/FundriseShell';
import { useFundrise } from '../../../contexts/FundriseContext';
import config from '../../../resources/config/config';

const RUST = '#AA4528';

const options = [
    {
        id: 'general',
        label: 'General investing account',
        badge: '$10 minimum',
        description: 'A flexible investing account created to help you build long-term wealth.',
    },
    {
        id: 'retirement',
        label: 'Retirement account',
        badge: '$1,000 minimum',
        description: 'Transfer, rollover, or start a new IRA with tax benefits for your retirement.',
    },
] as const;

export default function QuestionAccountType() {
    const navigate = useNavigate();
    const { state, update } = useFundrise();
    const [selected, setSelected] = useState<'general' | 'retirement' | null>(state.accountType);

    useEffect(() => {
        window.scrollTo(0, 0);
        // Verify user is authenticated
        const check = async () => {
            if (!config.supabaseClient) return;
            const { data: { user } } = await config.supabaseClient.auth.getUser();
            if (!user) navigate('/Login');
        };
        check();
    }, [navigate]);

    const handleContinue = () => {
        if (!selected) return;
        update({ accountType: selected });
        navigate('/questions/intro');
    };

    return (
        <FundriseShell onClose={() => navigate('/')}>
            {/* White card */}
            <div className="bg-white rounded-xl border border-[#EEE9E0] shadow-[0_2px_20px_rgba(21,21,19,0.06)] px-6 py-8 sm:px-10">
                <h1
                    className="text-[1.75rem] font-semibold text-[#151513] mb-2 leading-tight"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                    What account would you like to open?
                </h1>
                <p className="text-[15px] text-[#5C564D] mb-8 leading-relaxed">
                    Start creating an account that meets your goals. You can add another later.
                </p>

                <div className="space-y-3 mb-8">
                    {options.map(opt => {
                        const isSelected = selected === opt.id;
                        return (
                            <button
                                key={opt.id}
                                onClick={() => setSelected(opt.id)}
                                className={`w-full text-left flex items-start justify-between gap-4 px-5 py-5 rounded-lg border-2 transition-all duration-150 ${isSelected
                                        ? 'border-[#AA4528] bg-[#FDF9F7]'
                                        : 'border-[#EEE9E0] bg-white hover:border-[#C4BFB5]'
                                    }`}
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[16px] font-semibold text-[#151513]">{opt.label}</span>
                                        <span className="text-[11px] text-[#8C8479] font-medium bg-[#F2F0EB] px-2 py-0.5 rounded-full">
                                            {opt.badge}
                                        </span>
                                    </div>
                                    <p className="text-[14px] text-[#8C8479] leading-relaxed">{opt.description}</p>
                                </div>
                                {/* Radio circle */}
                                <div
                                    className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-[#AA4528]' : 'border-[#C4BFB5]'
                                        }`}
                                >
                                    {isSelected && (
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#AA4528]" />
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={handleContinue}
                    disabled={!selected}
                    className={`w-full py-4 rounded-lg text-[15px] font-semibold transition-all ${selected
                            ? 'bg-[#AA4528] text-white hover:bg-[#8C3720] active:scale-[0.99]'
                            : 'bg-[#EEE9E0] text-[#C4BFB5] cursor-not-allowed'
                        }`}
                    style={{ color: selected ? 'white' : undefined }}
                >
                    Continue
                </button>
            </div>
        </FundriseShell>
    );
}
