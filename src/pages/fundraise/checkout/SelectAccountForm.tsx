import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FundriseShell from '../../../components/FundriseShell';
import { useFundrise } from '../../../contexts/FundriseContext';

type AccountType = 'individual' | 'entity' | 'joint' | 'trust';

const OTHER_SUB_OPTIONS = [
    { id: 'entity', label: 'Entity Account' },
    { id: 'joint', label: 'Joint Account' },
    { id: 'trust', label: 'Trust Account' },
];

export default function SelectAccountForm() {
    const navigate = useNavigate();
    const { update } = useFundrise();
    const [selected, setSelected] = useState<AccountType>('individual');
    const [subSelected, setSubSelected] = useState<'entity' | 'joint' | 'trust' | null>(null);

    const isOther = selected !== 'individual';

    const handleContinue = () => {
        const finalType: AccountType = isOther && subSelected ? subSelected : 'individual';
        update({ accountForm: finalType });
        navigate('/reits/checkout/phone-number');
    };

    const canContinue = selected === 'individual' || (isOther && subSelected !== null);

    return (
        <FundriseShell onClose={() => navigate('/')}>
            <div className="bg-white rounded-xl border border-[#EEE9E0] shadow-[0_2px_20px_rgba(21,21,19,0.06)] px-6 py-8 sm:px-10">
                <h1
                    className="text-[1.75rem] font-semibold text-[#151513] mb-8 leading-tight"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                    What type of general account would you like to open?
                </h1>

                {/* Individual */}
                <div className="divide-y divide-[#F2F0EB] mb-6">
                    {/* Individual option */}
                    <button
                        onClick={() => { setSelected('individual'); setSubSelected(null); }}
                        className="w-full flex items-center justify-between py-4 -mx-1 px-1 rounded group hover:bg-[#FDFCFA] transition-colors"
                    >
                        <span className="text-[16px] font-medium text-[#151513]">Individual account</span>
                        <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selected === 'individual' ? 'border-[#AA4528]' : 'border-[#C4BFB5]'
                                }`}
                        >
                            {selected === 'individual' && <div className="w-2.5 h-2.5 rounded-full bg-[#AA4528]" />}
                        </div>
                    </button>

                    {/* Other account type */}
                    <button
                        onClick={() => setSelected('entity')}
                        className="w-full flex items-center justify-between py-4 -mx-1 px-1 rounded group hover:bg-[#FDFCFA] transition-colors"
                    >
                        <span className="text-[16px] font-medium text-[#151513]">Other account type</span>
                        <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isOther ? 'border-[#AA4528]' : 'border-[#C4BFB5]'
                                }`}
                        >
                            {isOther && <div className="w-2.5 h-2.5 rounded-full bg-[#AA4528]" />}
                        </div>
                    </button>
                </div>

                {/* Sub-options — shown when "Other account type" is selected */}
                {isOther && (
                    <div className="bg-[#F7F5F0] rounded-lg border border-[#EEE9E0] px-4 py-3 mb-6">
                        <div className="relative">
                            <select
                                value={subSelected || ''}
                                onChange={e => setSubSelected(e.target.value as any)}
                                className="w-full bg-transparent text-[15px] text-[#151513] focus:outline-none appearance-none pr-8 py-1 cursor-pointer"
                            >
                                <option value="" disabled>Select account type...</option>
                                {OTHER_SUB_OPTIONS.map(opt => (
                                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                                ))}
                            </select>
                            <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[#8C8479]">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="6,9 12,15 18,9" />
                                </svg>
                            </span>
                        </div>
                    </div>
                )}

                <button
                    onClick={handleContinue}
                    disabled={!canContinue}
                    className={`w-full py-4 rounded-lg text-[15px] font-semibold transition-all ${canContinue
                            ? 'bg-[#AA4528] text-white hover:bg-[#8C3720] active:scale-[0.99]'
                            : 'bg-[#EEE9E0] text-[#C4BFB5] cursor-not-allowed'
                        }`}
                >
                    Continue
                </button>
            </div>
        </FundriseShell>
    );
}
