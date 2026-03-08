import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FundriseShell from '../../../components/FundriseShell';
import { useFundrise } from '../../../contexts/FundriseContext';

export default function SignupCheckout() {
    const navigate = useNavigate();
    const { state } = useFundrise();
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [isResent, setIsResent] = useState(false);

    const handleDigit = (idx: number, val: string) => {
        if (!/^\d?$/.test(val)) return;
        const next = [...code];
        next[idx] = val;
        setCode(next);
        // Auto-focus next input
        if (val && idx < 5) {
            const nextInput = document.getElementById(`otp-${idx + 1}`);
            (nextInput as HTMLInputElement)?.focus();
        }
    };

    const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !code[idx] && idx > 0) {
            const prev = document.getElementById(`otp-${idx - 1}`);
            (prev as HTMLInputElement)?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        setCode(pasted.split('').concat(Array(6 - pasted.length).fill('')));
    };

    const isComplete = code.every(d => d.length === 1);

    const handleResend = () => {
        setIsResent(true);
        setTimeout(() => setIsResent(false), 5000);
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
                    Verify your phone number
                </h1>
                <p className="text-[14px] text-[#5C564D] mb-8 leading-relaxed">
                    We sent a 6-digit code to <span className="font-semibold text-[#151513]">{state.phone || 'your phone'}</span>. Enter it below to continue.
                </p>

                {/* OTP boxes */}
                <div className="flex gap-3 justify-center mb-8">
                    {code.map((digit, idx) => (
                        <input
                            key={idx}
                            id={`otp-${idx}`}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={e => handleDigit(idx, e.target.value)}
                            onKeyDown={e => handleKeyDown(idx, e)}
                            onPaste={idx === 0 ? handlePaste : undefined}
                            className={`w-12 h-14 text-center text-[22px] font-bold border-2 rounded-lg bg-[#F7F5F0]
                focus:outline-none focus:border-[#AA4528] focus:bg-white transition-all
                ${digit ? 'border-[#AA4528] bg-white' : 'border-[#C4BFB5]'}`}
                        />
                    ))}
                </div>

                {/* Resend link */}
                <p className="text-[13px] text-center text-[#5C564D] mb-6">
                    Didn't receive it?{' '}
                    <button
                        onClick={handleResend}
                        className="font-semibold text-[#AA4528] hover:text-[#8C3720] transition-colors"
                    >
                        {isResent ? 'Sent!' : 'Resend code'}
                    </button>
                </p>

                <button
                    onClick={() => navigate('/reits/checkout/individual-profile-form')}
                    disabled={!isComplete}
                    className={`w-full py-4 rounded-lg text-[15px] font-semibold transition-all ${isComplete
                            ? 'bg-[#AA4528] text-white hover:bg-[#8C3720] active:scale-[0.99]'
                            : 'bg-[#EEE9E0] text-[#C4BFB5] cursor-not-allowed'
                        }`}
                >
                    Verify & Continue
                </button>
            </div>
        </FundriseShell>
    );
}
