import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FundriseShell from '../../../components/FundriseShell';
import { useFundrise } from '../../../contexts/FundriseContext';

export default function PhoneNumber() {
    const navigate = useNavigate();
    const { state, update } = useFundrise();
    const [phone, setPhone] = useState(state.phone || '');
    const [error, setError] = useState('');

    const formatPhone = (val: string) => {
        const digits = val.replace(/\D/g, '').slice(0, 10);
        if (digits.length <= 3) return digits;
        if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(formatPhone(e.target.value));
        setError('');
    };

    const handleContinue = () => {
        const digits = phone.replace(/\D/g, '');
        if (digits.length < 10) {
            setError('Please enter a valid 10-digit phone number.');
            return;
        }
        update({ phone });
        navigate('/reits/signup-checkout/signup');
    };

    const isValid = phone.replace(/\D/g, '').length === 10;

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
                    What's your phone number?
                </h1>
                <p className="text-[14px] text-[#8C8479] mb-8 leading-relaxed">
                    We'll use this for account security and verification purposes.
                </p>

                <div className="mb-6">
                    <label className="block text-[13px] font-semibold text-[#4A4540] mb-1.5">
                        Phone number (mobile preferred)
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-[#8C8479] font-medium select-none">
                            +1
                        </span>
                        <input
                            type="tel"
                            value={phone}
                            onChange={handleInput}
                            placeholder="(555) 000-0000"
                            className={`w-full pl-12 pr-4 py-3.5 border rounded-lg text-[15px] text-[#151513] bg-[#F7F5F0]
                focus:outline-none focus:border-[#AA4528] focus:ring-2 focus:ring-[#AA4528]/20 transition-all
                focus:bg-white ${error ? 'border-red-400' : 'border-[#C4BFB5]'}`}
                        />
                    </div>
                    {error && <p className="text-[12px] text-red-500 mt-1.5">{error}</p>}
                    <p className="text-[12px] text-[#8C8479] mt-1.5 leading-relaxed">
                        Standard rates apply.
                    </p>
                </div>

                <button
                    onClick={handleContinue}
                    disabled={!isValid}
                    className={`w-full py-4 rounded-lg text-[15px] font-semibold transition-all ${isValid
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
