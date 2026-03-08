import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FundriseShell from '../../../components/FundriseShell';
import { useFundrise } from '../../../contexts/FundriseContext';

const FREQUENCY_OPTIONS = [
    { id: 'once_a_month', label: 'Once a month' },
    { id: 'twice_a_month', label: 'Twice a month' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'every_other_week', label: 'Every other week' },
] as const;

const AMOUNT_PRESETS = ['$1,000', '$2,500', '$5,000', '$7,500'];

const DAY_OPTIONS = ['1st', '2nd', '5th', '10th', '15th', '20th', '25th', 'Last day'];

type FrequencyType = 'once_a_month' | 'twice_a_month' | 'weekly' | 'every_other_week';

export default function AutoInvest() {
    const navigate = useNavigate();
    const { state, update } = useFundrise();

    const [frequency, setFrequency] = useState<FrequencyType>(state.autoInvestFrequency || 'once_a_month');
    const [day, setDay] = useState(state.autoInvestDay || '1st');
    const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
    const [customAmount, setCustomAmount] = useState('');

    const finalAmount = selectedPreset ?? (customAmount ? `$${customAmount}` : '');
    const canContinue = Boolean(finalAmount);

    const handleContinue = () => {
        update({
            autoInvestFrequency: frequency,
            autoInvestDay: day,
            autoInvestAmount: finalAmount,
        });
        navigate('/reits/checkout/select-payment-method');
    };

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
                    Make a recurring investment
                </h1>
                <p className="text-[14px] text-[#8C8479] mb-8">Grow your wealth with periodic contributions.</p>

                {/* Frequency pill buttons */}
                <div className="mb-6">
                    <p className="text-[13px] font-semibold text-[#4A4540] mb-3">Frequency</p>
                    <div className="flex flex-wrap gap-2">
                        {FREQUENCY_OPTIONS.map(opt => (
                            <button
                                key={opt.id}
                                onClick={() => setFrequency(opt.id)}
                                className={`px-4 py-2 rounded-full border text-[14px] font-medium transition-all ${frequency === opt.id
                                        ? 'border-[#4A4540] bg-white text-[#4A4540] font-semibold'
                                        : 'border-[#C4BFB5] text-[#8C8479] hover:border-[#8C8479]'
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Investment days dropdown */}
                <div className="mb-6">
                    <p className="text-[13px] font-semibold text-[#4A4540] mb-2">Investment days</p>
                    <div className="relative">
                        <select
                            value={day}
                            onChange={e => setDay(e.target.value)}
                            className="w-full border border-[#C4BFB5] rounded-lg px-4 py-3.5 text-[15px] text-[#151513]
                bg-[#F7F5F0] appearance-none focus:outline-none focus:border-[#AA4528] focus:ring-2 focus:ring-[#AA4528]/20 cursor-pointer"
                        >
                            {DAY_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#8C8479]">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="6,9 12,15 18,9" />
                            </svg>
                        </span>
                    </div>
                </div>

                {/* Amount presets */}
                <div className="mb-8">
                    <p className="text-[13px] font-semibold text-[#4A4540] mb-3">Amount</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {AMOUNT_PRESETS.map(amt => (
                            <button
                                key={amt}
                                onClick={() => { setSelectedPreset(amt); setCustomAmount(''); }}
                                className={`px-4 py-2 rounded-full border text-[14px] font-medium transition-all ${selectedPreset === amt
                                        ? 'border-[#4A4540] bg-white text-[#4A4540] font-semibold'
                                        : 'border-[#C4BFB5] text-[#8C8479] hover:border-[#8C8479]'
                                    }`}
                            >
                                {amt}
                            </button>
                        ))}
                    </div>
                    {/* Custom amount input */}
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-[#8C8479] select-none">$</span>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={customAmount}
                            onChange={e => { setCustomAmount(e.target.value.replace(/\D/g, '')); setSelectedPreset(null); }}
                            placeholder="Other Amount"
                            className="w-full pl-9 pr-4 py-3 border border-[#C4BFB5] rounded-lg text-[15px] text-[#151513]
                bg-white focus:outline-none focus:border-[#AA4528] focus:ring-2 focus:ring-[#AA4528]/20 transition-all
                placeholder:text-[#B0AAA3]"
                        />
                    </div>
                </div>

                {/* Continue */}
                <button
                    onClick={handleContinue}
                    disabled={!canContinue}
                    className={`w-full py-4 rounded-lg text-[15px] font-semibold transition-all mb-3 ${canContinue
                            ? 'bg-[#AA4528] text-white hover:bg-[#8C3720] active:scale-[0.99]'
                            : 'bg-[#EEE9E0] text-[#C4BFB5] cursor-not-allowed'
                        }`}
                >
                    Continue
                </button>

                {/* Do later */}
                <button
                    onClick={() => navigate('/reits/checkout/select-payment-method')}
                    className="w-full py-3 text-center text-[14px] font-semibold text-[#AA4528] hover:text-[#8C3720] transition-colors"
                >
                    I'll do this later
                </button>
            </div>
        </FundriseShell>
    );
}
