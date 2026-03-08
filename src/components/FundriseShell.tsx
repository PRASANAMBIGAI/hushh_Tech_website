/**
 * FundriseShell — Clean layout shell for the fundraising workflow.
 *
 * Lighter than OnboardingShell:
 *  - Cream (#faf9f6) full-screen background
 *  - White top bar: Back (left) | Hushh Logo (center) | X close (right)
 *  - No progress bar / step counter
 *  - Main content: centered white card, max-w-xl, rounded-md
 */
import React from 'react';
import { Link } from 'react-router-dom';
import hushhLogo from '../components/images/Hushhogo.png';

interface FundriseShellProps {
    /** Fires when user clicks "← Back" */
    onBack?: () => void;
    /** Fires when user clicks the X (close) */
    onClose?: () => void;
    /** Page content */
    children: React.ReactNode;
    /** Whether the card should have max-width constraint (default true) */
    constrainWidth?: boolean;
}

const FundriseShell: React.FC<FundriseShellProps> = ({
    onBack,
    onClose,
    children,
    constrainWidth = true,
}) => {
    return (
        <div
            className="min-h-[100dvh] flex flex-col bg-[#faf9f6]"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--fr-navy)' }}
        >
            {/* ═══════════════════════════════════════
          TOP NAV BAR
          ═══════════════════════════════════════ */}
            <header className="sticky top-0 z-40 bg-white border-b border-[#F2F0EB]">
                <div className="relative flex items-center justify-between px-5 md:px-8 h-[60px] max-w-3xl mx-auto">
                    {/* ← Back */}
                    <div className="w-16">
                        {onBack && (
                            <button
                                onClick={onBack}
                                className="flex items-center gap-0.5 text-[14px] font-semibold text-[#4A4540] hover:text-[#151513] transition-colors group"
                                aria-label="Go back"
                            >
                                <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-0.5 transition-transform">
                                    chevron_left
                                </span>
                                Back
                            </button>
                        )}
                    </div>

                    {/* Center — Logo */}
                    <Link
                        to="/"
                        className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5"
                        aria-label="Hushh Home"
                    >
                        <img src={hushhLogo} alt="Hushh" className="w-7 h-7 object-contain" />
                        <span className="text-[15px] font-bold text-[#151513] tracking-tight hidden sm:block">
                            hushh
                        </span>
                    </Link>

                    {/* Right — X close */}
                    <div className="w-16 flex justify-end">
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F2F0EB] transition-colors"
                                aria-label="Close"
                            >
                                <span className="material-symbols-outlined text-[#4A4540] text-[20px]">close</span>
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* ═══════════════════════════════════════
          MAIN CONTENT
          ═══════════════════════════════════════ */}
            <main className="flex-1 flex flex-col items-center px-4 py-10 md:py-14">
                <div className={constrainWidth ? 'w-full max-w-xl' : 'w-full max-w-3xl'}>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default FundriseShell;
