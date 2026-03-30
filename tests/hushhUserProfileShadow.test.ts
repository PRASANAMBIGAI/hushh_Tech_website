// @vitest-environment jsdom

import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let mockLogicState: any;

vi.mock('../src/pages/hushh-user-profile/logic', () => ({
  useHushhUserProfileLogic: () => mockLogicState,
  FIELD_LABELS: {},
  VALUE_LABELS: {},
}));

vi.mock('../src/components/hushh-tech-back-header/HushhTechBackHeader', () => ({
  default: () => React.createElement('div', { 'data-testid': 'back-header' }),
}));

vi.mock('../src/components/hushh-tech-cta/HushhTechCta', () => ({
  default: ({ children, onClick, disabled }: any) =>
    React.createElement('button', { type: 'button', onClick, disabled }, children),
  HushhTechCtaVariant: {
    BLACK: 'BLACK',
    WHITE: 'WHITE',
  },
}));

vi.mock('../src/components/hushh-tech-footer/HushhTechFooter', () => ({
  default: () => React.createElement('div', { 'data-testid': 'footer' }),
  HushhFooterTab: {
    HOME: 'HOME',
    FUND_A: 'FUND_A',
    COMMUNITY: 'COMMUNITY',
    PROFILE: 'PROFILE',
  },
}));

vi.mock('../src/components/profile/NWSScoreBadge', () => ({
  default: () => React.createElement('div', { 'data-testid': 'nws-badge' }),
}));

import HushhUserProfilePage from '../src/pages/hushh-user-profile/ui';

const createLogicState = (overrides: Record<string, unknown> = {}) => ({
  form: {
    name: 'Ankit Singh',
    email: 'ankit@example.com',
    age: 31,
    phoneCountryCode: '+91',
    phoneNumber: '9876543210',
    organisation: 'Hushh',
    accountType: 'individual',
    selectedFund: 'hushh_fund_a',
    referralSource: '',
    citizenshipCountry: 'India',
    residenceCountry: 'India',
    accountStructure: 'individual',
    legalFirstName: 'Ankit',
    legalLastName: 'Singh',
    addressLine1: 'E-707',
    city: 'Pune',
    state: 'Maharashtra',
    zipCode: '411045',
    dateOfBirth: '1994-01-10',
    initialInvestmentAmount: 50000,
  },
  investorProfile: {
    primary_goal: {
      value: 'long_term_growth',
      confidence: 0.91,
    },
  },
  loading: false,
  loadingSeconds: 0,
  isProcessing: false,
  investorStatus: 'done',
  shadowStatus: 'error',
  hasOnboardingData: true,
  isApplePassLoading: false,
  isGooglePassLoading: false,
  nwsResult: null,
  nwsLoading: false,
  hasCopied: false,
  onCopy: vi.fn(),
  profileUrl: 'https://hushhtech.com/investor/ankit-singh',
  navigate: vi.fn(),
  handleChange: vi.fn(),
  handleBack: vi.fn(),
  handleSave: vi.fn(),
  handleRetryShadow: vi.fn(),
  isDirty: false,
  isSaving: false,
  handleSaveChanges: vi.fn(),
  handleAppleWalletPass: vi.fn(),
  handleGoogleWalletPass: vi.fn(),
  COUNTRIES: ['India', 'United States'],
  editingField: null,
  setEditingField: vi.fn(),
  FIELD_OPTIONS: {},
  MULTI_SELECT_FIELDS: [],
  handleUpdateAIField: vi.fn(),
  handleMultiSelectToggle: vi.fn(),
  getConfidenceLabel: vi.fn(() => 'High'),
  getConfidenceBadgeClass: vi.fn(() => 'border-emerald-200'),
  shadowProfile: null,
  shadowLoading: false,
  shadowErrorMessage: 'Shadow profile generation is temporarily unavailable. Please try again.',
  shadowConfidenceLabel: 'Low',
  shadowLifestyleTags: [],
  shadowBrandTags: [],
  shadowKnownForTags: [],
  ...overrides,
});

describe('Hushh user profile shadow failure UI', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    mockLogicState = createLogicState();
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    container.remove();
  });

  it('shows the shadow error state without hiding the investor profile section', async () => {
    await act(async () => {
      root.render(React.createElement(HushhUserProfilePage));
    });

    const text = container.textContent || '';
    expect(text).toContain('Shadow Profile Needs Attention');
    expect(text).toContain('Shadow profile generation is temporarily unavailable. Please try again.');
    expect(text).toContain('Investment');
    expect(text).toContain('Profile.');
  });

  it('offers a dedicated retry action for shadow generation failures', async () => {
    const handleRetryShadow = vi.fn();
    mockLogicState = createLogicState({
      handleRetryShadow,
      shadowProfile: {
        confidence: 42,
        netWorthScore: 10,
        occupation: 'Founder',
        nationality: 'Indian',
        knownFor: ['Hushh'],
        diet: '',
        hobbies: [],
        coffeePreferences: [],
        chaiPreferences: [],
        drinkPreferences: [],
        brands: [],
      },
    });

    await act(async () => {
      root.render(React.createElement(HushhUserProfilePage));
    });

    const text = container.textContent || '';
    expect(text).toContain('Showing Saved Data');
    expect(text).toContain('Your previous shadow profile is still visible below while you retry.');

    const retryButton = Array.from(container.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Retry Shadow Analysis')
    );

    expect(retryButton).toBeDefined();

    await act(async () => {
      retryButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(handleRetryShadow).toHaveBeenCalledTimes(1);
  });
});
