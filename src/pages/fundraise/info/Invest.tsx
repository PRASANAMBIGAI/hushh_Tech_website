import { useNavigate } from 'react-router-dom';
import FundriseShell from '../../../components/FundriseShell';

// Dartboard/target illustration
const TargetIllustration = () => (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
        {/* Outer ring */}
        <circle cx="36" cy="38" r="28" fill="#EEE9E0" />
        <circle cx="36" cy="38" r="20" fill="#E0D8CC" />
        <circle cx="36" cy="38" r="13" fill="#C4BFB5" />
        <circle cx="36" cy="38" r="7" fill="#AA4528" />
        {/* Arrow */}
        <line x1="24" y1="26" x2="37" y2="39" stroke="#4A4540" strokeWidth="2.5" strokeLinecap="round" />
        <polygon points="21,23 28,24 24,30" fill="#4A4540" />
    </svg>
);

export default function InfoInvest() {
    const navigate = useNavigate();

    return (
        <FundriseShell onClose={() => navigate('/')}>
            <div className="bg-white rounded-xl border border-[#EEE9E0] shadow-[0_2px_20px_rgba(21,21,19,0.06)] px-6 py-10 sm:px-10 flex flex-col items-start">
                <div className="mb-6">
                    <TargetIllustration />
                </div>

                <h1
                    className="text-[1.75rem] font-semibold text-[#151513] mb-3 leading-tight"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                    Finish up and invest
                </h1>
                <p className="text-[15px] text-[#5C564D] mb-8 leading-relaxed">
                    Finally, we'll collect your initial investment amount, securely connect a funding source, and place your investment when you're ready.
                </p>

                <button
                    onClick={() => navigate('/reits/checkout/payment-amount')}
                    className="w-full py-4 rounded-lg bg-[#AA4528] text-white text-[15px] font-semibold hover:bg-[#8C3720] active:scale-[0.99] transition-all"
                >
                    Continue
                </button>
            </div>
        </FundriseShell>
    );
}
