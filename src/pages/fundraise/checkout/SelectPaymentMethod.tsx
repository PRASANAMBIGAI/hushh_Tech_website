import { useNavigate } from 'react-router-dom';
import FundriseShell from '../../../components/FundriseShell';

const LockIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5C564D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const EyeOffIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5C564D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
);

const ShieldIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5C564D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

// Hushh mini logo SVG for top connection graphic
const HushhBrandIcon = () => (
    <div className="w-14 h-14 bg-[#F7F5F0] rounded-xl flex items-center justify-center border border-[#EEE9E0]">
        <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
            <rect x="4" y="8" width="6" height="24" rx="3" fill="#AA4528" />
            <rect x="14" y="4" width="6" height="32" rx="3" fill="#AA4528" />
            <rect x="24" y="12" width="6" height="16" rx="3" fill="#AA4528" />
        </svg>
    </div>
);

// Plaid-style icon
const PlaidIcon = () => (
    <div className="w-14 h-14 bg-[#1A1A1A] rounded-xl flex items-center justify-center border border-[#333]">
        <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
            <rect x="8" y="8" width="8" height="8" fill="white" rx="1" />
            <rect x="18" y="8" width="8" height="8" fill="white" rx="1" />
            <rect x="8" y="18" width="8" height="8" fill="white" rx="1" />
            <rect x="18" y="18" width="8" height="8" fill="white" rx="1" />
        </svg>
    </div>
);

const FEATURES = [
    { icon: <LockIcon />, text: 'Secure, read-only data connection' },
    { icon: <EyeOffIcon />, text: 'Your credentials are kept private and not stored by Hushh' },
    { icon: <ShieldIcon />, text: 'We use commercial bank-level encryption standards to keep your data secure' },
];

export default function SelectPaymentMethod() {
    const navigate = useNavigate();

    return (
        <FundriseShell
            onBack={() => navigate(-1 as any)}
            onClose={() => navigate('/')}
        >
            <div className="bg-white rounded-xl border border-[#EEE9E0] shadow-[0_2px_20px_rgba(21,21,19,0.06)] px-6 py-10 sm:px-10">
                {/* Connection graphic */}
                <div className="flex items-center gap-3 mb-8">
                    <HushhBrandIcon />
                    <div className="flex-1 h-0.5 bg-[#C4BFB5]" />
                    <PlaidIcon />
                </div>

                <h1
                    className="text-[1.75rem] font-semibold text-[#151513] mb-3 leading-tight"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                    Securely connect a funding source to invest
                </h1>
                <p className="text-[15px] text-[#AA4528] mb-8 leading-relaxed">
                    Hushh has partnered with Plaid to securely connect your external account.
                </p>

                {/* Features list */}
                <div className="space-y-5 mb-10">
                    {FEATURES.map((f, i) => (
                        <div key={i} className="flex items-start gap-4">
                            <span className="flex-shrink-0 mt-0.5">{f.icon}</span>
                            <p className="text-[15px] text-[#5C564D] leading-relaxed">{f.text}</p>
                        </div>
                    ))}
                </div>

                {/* Continue → final success / dashboard */}
                <button
                    onClick={() => navigate('/')}
                    className="w-full py-4 rounded-lg bg-[#AA4528] text-white text-[15px] font-semibold hover:bg-[#8C3720] active:scale-[0.99] transition-all"
                >
                    Continue
                </button>
            </div>
        </FundriseShell>
    );
}
