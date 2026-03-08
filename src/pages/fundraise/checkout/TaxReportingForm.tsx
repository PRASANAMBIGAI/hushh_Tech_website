import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FundriseShell from '../../../components/FundriseShell';
import { useFundrise } from '../../../contexts/FundriseContext';

const LockIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8C8479" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const inputClass = `w-full px-4 py-3 border border-[#C4BFB5] rounded-lg text-[15px] text-[#151513]
  bg-[#F2F0EB] focus:outline-none focus:border-[#AA4528] focus:ring-2 focus:ring-[#AA4528]/20
  focus:bg-white transition-all placeholder:text-[#B0AAA3]`;

const labelClass = 'block text-[13px] font-semibold text-[#4A4540] mb-1.5';

export default function TaxReportingForm() {
    const navigate = useNavigate();
    const { state, update } = useFundrise();

    const [ssn, setSsn] = useState(state.ssn || '');
    const [dob, setDob] = useState(state.dob || '');

    const formatSSN = (val: string) => {
        const d = val.replace(/\D/g, '').slice(0, 9);
        if (d.length <= 3) return d;
        if (d.length <= 5) return `${d.slice(0, 3)}-${d.slice(3)}`;
        return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`;
    };

    const formatDOB = (val: string) => {
        const d = val.replace(/\D/g, '').slice(0, 8);
        if (d.length <= 2) return d;
        if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
        return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
    };

    const ssnDigits = ssn.replace(/\D/g, '');
    const dobDigits = dob.replace(/\D/g, '');
    const isValid = ssnDigits.length === 9 && dobDigits.length === 8;

    const handleContinue = () => {
        if (!isValid) return;
        update({ ssn, dob });
        navigate('/info/invest');
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
                    We just need a few more details
                </h1>
                <p className="text-[14px] text-[#AA4528] mb-8">
                    This should be the same information you use on your tax returns.
                </p>

                {/* SSN */}
                <div className="mb-5">
                    <label className={labelClass}>Social Security number</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={ssn}
                        onChange={e => setSsn(formatSSN(e.target.value))}
                        placeholder="___-__-____"
                        className={inputClass}
                    />
                </div>

                {/* SSN info box */}
                <div className="bg-[#F7F5F0] rounded-lg p-4 border border-[#EEE9E0] mb-5">
                    <div className="flex gap-3">
                        <span className="flex-shrink-0 mt-0.5"><LockIcon /></span>
                        <div>
                            <p className="text-[13px] font-semibold text-[#151513] mb-1">Why do we need your SSN?</p>
                            <p className="text-[13px] text-[#5C564D] leading-relaxed">
                                Federal law requires us to collect this for tax reporting purposes. Your data is encrypted and protected with bank-grade security.
                            </p>
                        </div>
                    </div>
                </div>

                {/* DOB */}
                <div className="mb-8">
                    <label className={labelClass}>Date of birth</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={dob}
                        onChange={e => setDob(formatDOB(e.target.value))}
                        placeholder="MM/DD/YYYY"
                        className={inputClass}
                    />
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
