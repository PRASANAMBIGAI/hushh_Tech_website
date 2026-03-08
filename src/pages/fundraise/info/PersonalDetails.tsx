import { useNavigate } from 'react-router-dom';
import FundriseShell from '../../../components/FundriseShell';

// Document-upload style illustration
const DocumentIllustration = () => (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
        {/* Base document */}
        <rect x="12" y="10" width="38" height="48" rx="4" fill="#E8E4DC" stroke="#C4BFB5" strokeWidth="1.5" />
        {/* Lines on document */}
        <line x1="20" y1="26" x2="42" y2="26" stroke="#C4BFB5" strokeWidth="2" strokeLinecap="round" />
        <line x1="20" y1="33" x2="42" y2="33" stroke="#C4BFB5" strokeWidth="2" strokeLinecap="round" />
        <line x1="20" y1="40" x2="34" y2="40" stroke="#C4BFB5" strokeWidth="2" strokeLinecap="round" />
        {/* ID badge overlay */}
        <rect x="28" y="38" width="32" height="22" rx="4" fill="white" stroke="#C4BFB5" strokeWidth="1.5" />
        <circle cx="36" cy="46" r="4" fill="#EEE9E0" />
        <line x1="33" y1="55" x2="47" y2="55" stroke="#C4BFB5" strokeWidth="1.5" strokeLinecap="round" />
        {/* Upload arrow */}
        <circle cx="44" cy="28" r="10" fill="#B5953A" opacity="0.9" />
        <polyline points="44,24 44,32" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <polyline points="41,27 44,24 47,27" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function InfoPersonalDetails() {
    const navigate = useNavigate();

    return (
        <FundriseShell
            onBack={() => navigate(-1 as any)}
            onClose={() => navigate('/')}
        >
            <div className="bg-white rounded-xl border border-[#EEE9E0] shadow-[0_2px_20px_rgba(21,21,19,0.06)] px-6 py-10 sm:px-10 flex flex-col items-start">
                <div className="mb-6">
                    <DocumentIllustration />
                </div>

                <h1
                    className="text-[1.75rem] font-semibold text-[#151513] mb-3 leading-tight"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                    Let's continue with some information about you
                </h1>
                <p className="text-[15px] text-[#5C564D] mb-8 leading-relaxed">
                    To comply with federal regulations, and as is typical with any investment platform, we are required to collect certain personal information about you.
                </p>

                <button
                    onClick={() => navigate('/reits/checkout/select-country')}
                    className="w-full py-4 rounded-lg bg-[#AA4528] text-white text-[15px] font-semibold hover:bg-[#8C3720] active:scale-[0.99] transition-all"
                >
                    Continue
                </button>
            </div>
        </FundriseShell>
    );
}
