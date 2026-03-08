import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FundriseShell from '../../../components/FundriseShell';
import { useFundrise } from '../../../contexts/FundriseContext';

// Icons for key benefits
const CoinIcon = () => (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect width="36" height="36" rx="8" fill="#F7F5F0" />
        <circle cx="18" cy="18" r="8" stroke="#B5953A" strokeWidth="1.5" fill="#FFF8E7" />
        <text x="18" y="22" textAnchor="middle" fontSize="10" fill="#B5953A" fontWeight="bold">$</text>
    </svg>
);

const ShieldIcon = () => (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect width="36" height="36" rx="8" fill="#F7F5F0" />
        <path d="M18 10 L26 14 L26 20 C26 24 18 28 18 28 C18 28 10 24 10 20 L10 14 Z" stroke="#8BAAB5" strokeWidth="1.5" fill="#EDF3F6" />
    </svg>
);

const DiversifyIcon = () => (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect width="36" height="36" rx="8" fill="#F7F5F0" />
        <circle cx="14" cy="18" r="5" stroke="#AA4528" strokeWidth="1.5" fill="#FDF0EC" />
        <circle cx="22" cy="18" r="5" stroke="#8BAAB5" strokeWidth="1.5" fill="#EDF3F6" />
    </svg>
);

export default function SelectFundInvestmentDetail() {
    const navigate = useNavigate();
    const { state } = useFundrise();

    return (
        <FundriseShell
            onBack={() => navigate(-1 as any)}
            onClose={() => navigate('/')}
        >
            <div className="bg-white rounded-xl border border-[#EEE9E0] shadow-[0_2px_20px_rgba(21,21,19,0.06)] px-6 py-8 sm:px-10">
                {/* Header */}
                <h1
                    className="text-[1.75rem] font-semibold text-[#151513] mb-2 leading-tight"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                    Income Real Estate Fund
                </h1>
                <p className="text-[14px] leading-relaxed mb-6">
                    <span className="text-[#5C564D]">A diversified </span>
                    <span className="text-[#AA4528] font-medium">private credit fund</span>
                    <span className="text-[#5C564D]"> backed primarily by </span>
                    <span className="text-[#AA4528] font-medium">real estate assets</span>
                    <span className="text-[#5C564D]">.</span>
                </p>

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                    <div className="bg-[#F7F5F0] rounded-lg p-4 border border-[#EEE9E0]">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8C8479] mb-1 border-b border-dashed border-[#C4BFB5] pb-1">
                            Current dividend rate
                        </p>
                        <p className="text-[1.5rem] font-bold text-[#151513]" style={{ fontFamily: 'Georgia, serif' }}>
                            7.97%
                        </p>
                    </div>
                    <div className="bg-[#F7F5F0] rounded-lg p-4 border border-[#EEE9E0]">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8C8479] mb-1 border-b border-dashed border-[#C4BFB5] pb-1">
                            Net asset value
                        </p>
                        <p className="text-[1.5rem] font-bold text-[#151513]" style={{ fontFamily: 'Georgia, serif' }}>
                            $632M+
                        </p>
                    </div>
                </div>

                {/* Key benefits */}
                <div className="mb-8">
                    <h2 className="text-[15px] font-semibold text-[#151513] mb-4">Key benefits</h2>
                    <div className="space-y-4">
                        <div className="flex gap-4 items-start">
                            <CoinIcon />
                            <div>
                                <p className="text-[14px] font-semibold text-[#151513] mb-0.5">Attractive, predictable income</p>
                                <p className="text-[13px] text-[#8C8479]">Cash flow in the form of quarterly dividends.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <ShieldIcon />
                            <div>
                                <p className="text-[14px] font-semibold text-[#151513] mb-0.5">Downside protection</p>
                                <p className="text-[13px] text-[#8C8479]">Loans are secured by real estate assets.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <DiversifyIcon />
                            <div>
                                <p className="text-[14px] font-semibold text-[#151513] mb-0.5">Diversification and stability</p>
                                <p className="text-[13px] text-[#8C8479]">Assets are less correlated with public markets.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Disclosures link */}
                <p className="text-[13px] text-[#AA4528] mb-6 cursor-pointer hover:underline">Important disclosures</p>

                {/* Continue CTA */}
                <button
                    onClick={() => navigate('/info/personal-details')}
                    className="w-full py-4 rounded-lg bg-[#AA4528] text-white text-[15px] font-semibold hover:bg-[#8C3720] active:scale-[0.99] transition-all"
                >
                    Continue
                </button>
            </div>
        </FundriseShell>
    );
}
