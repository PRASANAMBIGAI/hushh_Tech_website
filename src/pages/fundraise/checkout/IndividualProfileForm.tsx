import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FundriseShell from '../../../components/FundriseShell';
import { useFundrise } from '../../../contexts/FundriseContext';

const US_STATES = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
    'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina',
    'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
    'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
];

const inputClass = `w-full px-4 py-3 border border-[#C4BFB5] rounded-lg text-[15px] text-[#151513]
  bg-[#F2F0EB] focus:outline-none focus:border-[#AA4528] focus:ring-2 focus:ring-[#AA4528]/20
  focus:bg-white transition-all placeholder:text-[#B0AAA3]`;

const labelClass = 'block text-[13px] font-semibold text-[#4A4540] mb-1.5';

export default function IndividualProfileForm() {
    const navigate = useNavigate();
    const { state, update } = useFundrise();

    const [address1, setAddress1] = useState(state.address1 || '');
    const [address2, setAddress2] = useState(state.address2 || '');
    const [city, setCity] = useState(state.city || '');
    const [st, setSt] = useState(state.state || '');
    const [zipcode, setZipcode] = useState(state.zipcode || '');
    const [phoneNum, setPhoneNum] = useState(state.phone || '');

    const formatPhone = (val: string) => {
        const digits = val.replace(/\D/g, '').slice(0, 10);
        if (digits.length <= 3) return digits;
        if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    };

    const isValid = address1.trim() && city.trim() && st && zipcode.trim().length >= 5
        && phoneNum.replace(/\D/g, '').length === 10;

    const handleContinue = () => {
        if (!isValid) return;
        update({ address1, address2, city, state: st, zipcode, phone: phoneNum });
        navigate('/reits/checkout/tax-reporting-form');
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
                    Enter your address and phone number
                </h1>
                <p className="text-[14px] text-[#AA4528] mb-8">
                    This should be the same information you use on your tax returns.
                </p>

                <div className="space-y-5">
                    {/* Address line 1 */}
                    <div>
                        <label className={labelClass}>Address line 1</label>
                        <input
                            type="text"
                            value={address1}
                            onChange={e => setAddress1(e.target.value)}
                            placeholder="123 Main St"
                            className={inputClass}
                        />
                        <p className="text-[12px] text-[#AA4528] mt-1">This should be the address used for tax purposes</p>
                    </div>

                    {/* Address line 2 */}
                    <div>
                        <label className={labelClass}>Address line 2</label>
                        <input
                            type="text"
                            value={address2}
                            onChange={e => setAddress2(e.target.value)}
                            placeholder="Apt, Suite, Unit (optional)"
                            className={inputClass}
                        />
                    </div>

                    {/* City + State */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelClass}>City</label>
                            <input
                                type="text"
                                value={city}
                                onChange={e => setCity(e.target.value)}
                                placeholder="New York"
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>State</label>
                            <div className="relative">
                                <select
                                    value={st}
                                    onChange={e => setSt(e.target.value)}
                                    className={`${inputClass} appearance-none pr-8`}
                                >
                                    <option value="">State</option>
                                    {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8C8479]">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="6,9 12,15 18,9" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Zipcode */}
                    <div>
                        <label className={labelClass}>Zipcode</label>
                        <input
                            type="text"
                            maxLength={5}
                            value={zipcode}
                            onChange={e => setZipcode(e.target.value.replace(/\D/g, ''))}
                            placeholder="10001"
                            className={inputClass}
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className={labelClass}>Phone number (mobile preferred)</label>
                        <input
                            type="tel"
                            value={phoneNum}
                            onChange={e => setPhoneNum(formatPhone(e.target.value))}
                            placeholder="(702) 345-6789"
                            className={inputClass}
                        />
                        <p className="text-[12px] text-[#8C8479] mt-1 leading-relaxed">
                            Hushh uses your phone number for sending verification codes to secure your account. You may disable this in settings. Standard rates apply.
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleContinue}
                    disabled={!isValid}
                    className={`w-full mt-8 py-4 rounded-lg text-[15px] font-semibold transition-all ${isValid
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
