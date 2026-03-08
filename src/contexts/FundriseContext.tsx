/**
 * FundriseContext — Shared state for the fundraising onboarding workflow.
 * Persisted to sessionStorage so the data survives page refreshes during the flow.
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface FundriseState {
    accountType: 'general' | 'retirement' | null;
    portfolioGoal: 'long_term' | 'short_term' | null;
    primaryGoal: 'diversification' | 'fixed_income' | null;
    income: string | null;
    yearlyInvestment: string | null;
    isAccredited: boolean | null;
    isQualifiedPurchaser: boolean | null;
    hdyhSource: string | null;
    selectedPlan: 'supplemental_income' | 'balanced_investing' | 'long_term_growth' | null;
    // Profile info
    citizenship: string;
    residence: string;
    accountForm: 'individual' | 'entity' | 'joint' | 'trust' | null;
    phone: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zipcode: string;
    ssn: string;
    dob: string;
    investmentAmount: string;
    // Auto-invest
    autoInvestFrequency: 'once_a_month' | 'twice_a_month' | 'weekly' | 'every_other_week';
    autoInvestDay: string;
    autoInvestAmount: string;
}

const DEFAULT_STATE: FundriseState = {
    accountType: null,
    portfolioGoal: null,
    primaryGoal: null,
    income: null,
    yearlyInvestment: null,
    isAccredited: null,
    isQualifiedPurchaser: null,
    hdyhSource: null,
    selectedPlan: null,
    citizenship: 'United States',
    residence: 'United States',
    accountForm: null,
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipcode: '',
    ssn: '',
    dob: '',
    investmentAmount: '',
    autoInvestFrequency: 'once_a_month',
    autoInvestDay: '1st',
    autoInvestAmount: '',
};

const SESSION_KEY = 'fundrise_workflow_state';

interface FundriseContextValue {
    state: FundriseState;
    update: (partial: Partial<FundriseState>) => void;
    reset: () => void;
}

const FundriseContext = createContext<FundriseContextValue | null>(null);

export const FundriseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<FundriseState>(() => {
        try {
            const stored = sessionStorage.getItem(SESSION_KEY);
            return stored ? { ...DEFAULT_STATE, ...JSON.parse(stored) } : DEFAULT_STATE;
        } catch {
            return DEFAULT_STATE;
        }
    });

    useEffect(() => {
        try {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
        } catch {
            // Ignore storage errors
        }
    }, [state]);

    const update = (partial: Partial<FundriseState>) => {
        setState(prev => ({ ...prev, ...partial }));
    };

    const reset = () => {
        sessionStorage.removeItem(SESSION_KEY);
        setState(DEFAULT_STATE);
    };

    return (
        <FundriseContext.Provider value={{ state, update, reset }}>
            {children}
        </FundriseContext.Provider>
    );
};

export const useFundrise = (): FundriseContextValue => {
    const ctx = useContext(FundriseContext);
    if (!ctx) throw new Error('useFundrise must be used within FundriseProvider');
    return ctx;
};

export default FundriseContext;
