import { useNavigate } from 'react-router-dom';
import FundriseShell from '../../../components/FundriseShell';
import { useFundrise } from '../../../contexts/FundriseContext';

// Compass SVG icon (simplified Fundrise-style)
const CompassIcon = () => (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
        <circle cx="40" cy="40" r="36" stroke="#C4BFB5" strokeWidth="2" fill="white" />
        <circle cx="40" cy="40" r="28" stroke="#EEE9E0" strokeWidth="1.5" fill="none" />
        {/* Ring arc - gold */}
        <path d="M40 4 A36 36 0 0 1 74 28" stroke="#B5953A" strokeWidth="6" strokeLinecap="round" fill="none" />
        {/* Needle down */}
        <polygon points="40,24 37,44 40,42 43,44" fill="#AA4528" />
        {/* Needle up */}
        <polygon points="40,56 37,36 40,38 43,36" fill="#E5E0D8" />
        {/* Center dot */}
        <circle cx="40" cy="40" r="3" fill="#4A4540" />
    </svg>
);

export default function QuestionIntro() {
    const navigate = useNavigate();
    const { state } = useFundrise();

    return (
        <FundriseShell
            onBack={() => navigate('/questions/account_type')}
            onClose={() => navigate('/')}
        >
            <div className="bg-white rounded-xl border border-[#EEE9E0] shadow-[0_2px_20px_rgba(21,21,19,0.06)] px-6 py-10 sm:px-10 flex flex-col items-start">
                {/* Compass illustration */}
                <div className="mb-6">
                    <CompassIcon />
                </div>

                <h1
                    className="text-[1.75rem] font-semibold text-[#151513] mb-3 leading-tight"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                    Let's find the best portfolio for you
                </h1>
                <p className="text-[15px] text-[#5C564D] mb-8 leading-relaxed">
                    Answer a short series of questions so we can recommend the right Hushh portfolio for you.
                </p>

                {/* Get started CTA */}
                <button
                    onClick={() => navigate('/questions/success')}
                    className="w-full py-4 rounded-lg text-[15px] font-semibold bg-[#AA4528] text-white hover:bg-[#8C3720] active:scale-[0.99] transition-all mb-4"
                >
                    Get started
                </button>

                {/* Already know what I want link */}
                <button
                    onClick={() => navigate('/reits/checkout/select-fund-investment-list')}
                    className="w-full text-center text-[15px] font-semibold text-[#AA4528] hover:text-[#8C3720] transition-colors py-2"
                >
                    I already know what I want
                </button>
            </div>
        </FundriseShell>
    );
}
