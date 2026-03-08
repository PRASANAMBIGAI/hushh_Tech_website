import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FundriseShell from '../../../components/FundriseShell';
import { useFundrise } from '../../../contexts/FundriseContext';

const COUNTRIES = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France',
    'Japan', 'India', 'Brazil', 'China', 'Other',
];

export default function SelectCountry() {
    const navigate = useNavigate();
    const { state, update } = useFundrise();
    const [citizenship, setCitizenship] = useState(state.citizenship || 'United States');
    const [residence, setResidence] = useState(state.residence || 'United States');

    const handleContinue = () => {
        update({ citizenship, residence });
        navigate('/reits/checkout/select-account-form');
    };

    const selectClass = `w-full border border-[#C4BFB5] rounded-lg px-4 py-3 text-[15px] text-[#151513]
    bg-white appearance-none focus:outline-none focus:border-[#AA4528] focus:ring-2 focus:ring-[#AA4528]/20
    transition-all cursor-pointer`;

    return (
        <FundriseShell
            onBack={() => navigate(-1 as any)}
            onClose={() => navigate('/')}
        >
            <div className="bg-white rounded-xl border border-[#EEE9E0] shadow-[0_2px_20px_rgba(21,21,19,0.06)] px-6 py-8 sm:px-10">
                <h1
                    className="text-[1.75rem] font-semibold text-[#151513] mb-2 leading-tight"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                    Confirm your residence
                </h1>
                <p className="text-[14px] text-[#AA4528] mb-8 leading-relaxed">
                    We only accept investments from residents of the United States at this time.
                </p>

                {/* Country of citizenship */}
                <div className="mb-5">
                    <label className="block text-[13px] font-semibold text-[#4A4540] mb-1.5">
                        Country of citizenship
                    </label>
                    <div className="relative">
                        <select
                            value={citizenship}
                            onChange={e => setCitizenship(e.target.value)}
                            className={selectClass}
                        >
                            {COUNTRIES.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#8C8479]">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="6,9 12,15 18,9" />
                            </svg>
                        </span>
                    </div>
                </div>

                {/* Country of residence */}
                <div className="mb-8">
                    <label className="block text-[13px] font-semibold text-[#4A4540] mb-1.5">
                        Country of residence
                    </label>
                    <div className="relative">
                        <select
                            value={residence}
                            onChange={e => setResidence(e.target.value)}
                            className={selectClass}
                        >
                            {COUNTRIES.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#8C8479]">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="6,9 12,15 18,9" />
                            </svg>
                        </span>
                    </div>
                </div>

                <button
                    onClick={handleContinue}
                    className="w-full py-4 rounded-lg bg-[#AA4528] text-white text-[15px] font-semibold hover:bg-[#8C3720] active:scale-[0.99] transition-all"
                >
                    Continue
                </button>
            </div>
        </FundriseShell>
    );
}
