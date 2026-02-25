/**
 * Fund A — Discover Page
 * Apple iOS Core App Colors + Proper English Capitalization.
 * Same design language as homepage, onboarding steps 1-8, profile.
 * All content from logic.ts — zero data here.
 */
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDiscoverFundALogic } from "./logic";
import HushhTechBackHeader from "../../components/hushh-tech-back-header/HushhTechBackHeader";
import HushhTechCta, {
  HushhTechCtaVariant,
} from "../../components/hushh-tech-cta/HushhTechCta";
import HushhTechFooter, {
  HushhFooterTab,
} from "../../components/hushh-tech-footer/HushhTechFooter";

/* ── settings-style row ── */
const FieldRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="group flex items-center justify-between border-b border-gray-200 py-4 hover:bg-gray-50/50 transition-colors -mx-6 px-6">
    <span className="text-sm text-gray-500 font-light">{label}</span>
    <div className="flex items-center gap-2 text-right">{children}</div>
  </div>
);

/* ── section label ── */
const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium mt-10 mb-2">
    {children}
  </p>
);

/* ── card with icon — Apple iOS colored icons ── */
const FeatureCard = ({
  icon,
  iconColor,
  title,
  description,
}: {
  icon: string;
  iconColor?: string;
  title: string;
  description: string;
}) => (
  <div className="flex items-start gap-4 bg-ios-gray-bg border border-gray-200/60 rounded-2xl p-5 hover:border-hushh-blue/30 transition-all">
    <div className="w-11 h-11 rounded-full border border-gray-200/60 flex items-center justify-center shrink-0 bg-white">
      <span className={`material-symbols-outlined !text-[1.15rem] ${iconColor || "text-hushh-blue"}`}>
        {icon}
      </span>
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="text-[13px] font-semibold text-black leading-snug mb-1">
        {title}
      </h3>
      <p className="text-[11px] text-gray-400 font-light leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);

/* ── icon + color map for cards ── */
const PHILOSOPHY_ICONS: Record<string, { icon: string; color: string }> = {
  "Options Intelligence": { icon: "psychology", color: "text-hushh-blue" },
  "AI-Enhanced Research": { icon: "neurology", color: "text-hushh-blue" },
  "Risk-First Architecture": { icon: "shield", color: "text-ios-green" },
  "Concentrated Conviction": { icon: "target", color: "text-ios-yellow" },
};

const EDGE_ICONS: Record<string, { icon: string; color: string }> = {
  "Volatility Harvesting": { icon: "trending_up", color: "text-ios-green" },
  "Asymmetric Returns": { icon: "rocket_launch", color: "text-hushh-blue" },
  "Income Generation": { icon: "payments", color: "text-ios-yellow" },
  "Downside Protection": { icon: "security", color: "text-hushh-blue" },
};

const ASSET_ICONS: Record<string, { icon: string; color: string }> = {
  "U.S. Large-Cap Equities": { icon: "account_balance", color: "text-hushh-blue" },
  "Strategic Options Overlay": { icon: "tune", color: "text-ios-yellow" },
  "Cash & Equivalents": { icon: "savings", color: "text-ios-green" },
};

const RISK_ICONS: Record<string, { icon: string; color: string }> = {
  "Position Limits": { icon: "pie_chart", color: "text-ios-yellow" },
  "Hedging Framework": { icon: "shield", color: "text-ios-green" },
  "Drawdown Protocols": { icon: "trending_down", color: "text-ios-red" },
  "Liquidity Management": { icon: "water_drop", color: "text-hushh-blue" },
};

const FundA = () => {
  const navigate = useNavigate();
  const {
    heroTitle,
    heroSubtitle,
    heroDescription,
    targetIRRLabel,
    targetIRRValue,
    targetIRRPeriod,
    targetIRRDisclaimer,
    philosophySectionTitle,
    philosophyCards,
    edgeSectionTitle,
    sellTheWallHref,
    edgeCards,
    assetFocusSectionTitle,
    assetFocusDescription,
    assetPillars,
    alphaStackSectionTitle,
    alphaStackSubtitle,
    alphaStackRows,
    riskSectionTitle,
    riskCards,
    keyTermsSectionTitle,
    keyTermsSubtitle,
    keyTerms,
    shareClasses,
    joinSectionTitle,
    joinSectionDescription,
    joinButtonLabel,
    handleCompleteProfile,
  } = useDiscoverFundALogic();

  return (
    <div className="bg-white text-gray-900 min-h-screen antialiased flex flex-col selection:bg-hushh-blue selection:text-white">
      {/* ═══ Header ═══ */}
      <HushhTechBackHeader
        onBackClick={() => navigate("/")}
        rightType="hamburger"
      />

      {/* ═══ Main ═══ */}
      <main className="px-6 flex-grow max-w-md mx-auto w-full pb-32">
        {/* ── Hero ── */}
        <section className="pt-6 pb-8">
          {/* pill badge — Apple blue tint like homepage */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-hushh-blue/20 rounded-full bg-hushh-blue/5 mb-6">
            <span className="w-1.5 h-1.5 bg-hushh-blue rounded-full" />
            <span className="text-[10px] tracking-[0.15em] uppercase font-medium text-hushh-blue">
              Flagship Fund
            </span>
          </div>

          <h1
            className="text-[2.75rem] leading-[1.1] font-normal text-black tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {heroTitle} <br />
            <span className="text-gray-400 italic font-light">{heroSubtitle}</span>
          </h1>

          <p className="text-[13px] text-gray-400 font-light mt-4 leading-relaxed max-w-xs">
            {heroDescription}
          </p>
        </section>

        {/* ── Target IRR (ios-dark card with blue glow) ── */}
        <section className="mb-8">
          <div className="bg-ios-dark rounded-2xl p-6 text-center relative overflow-hidden">
            {/* Apple blue glow */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-hushh-blue/15 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-hushh-blue/5 to-transparent" />
            <div className="relative z-10">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-3 font-medium">
                {targetIRRLabel}
              </p>
              <p
                className="text-[48px] leading-none font-medium text-ios-green mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {targetIRRValue}
              </p>
              <p className="text-[13px] text-gray-400 mb-4">
                {targetIRRPeriod}
              </p>
              <p className="text-[9px] text-gray-600 italic max-w-[220px] mx-auto leading-relaxed">
                {targetIRRDisclaimer}
              </p>
            </div>
          </div>
        </section>

        {/* ── Investment Philosophy ── */}
        <SectionLabel>{philosophySectionTitle}</SectionLabel>
        <div className="space-y-3 mb-2">
          {philosophyCards.map((card) => {
            const mapped = PHILOSOPHY_ICONS[card.title] || { icon: "lightbulb", color: "text-hushh-blue" };
            return (
              <FeatureCard
                key={card.title}
                icon={mapped.icon}
                iconColor={mapped.color}
                title={card.title}
                description={card.description}
              />
            );
          })}
        </div>

        {/* ── Sell the Wall Framework ── */}
        <SectionLabel>
          Our Edge —{" "}
          <a
            href={sellTheWallHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-hushh-blue underline decoration-hushh-blue/30 hover:decoration-hushh-blue transition-colors"
          >
            Sell the Wall
          </a>{" "}
          Framework
        </SectionLabel>
        <div className="space-y-3 mb-2">
          {edgeCards.map((card) => {
            const mapped = EDGE_ICONS[card.title] || { icon: "auto_awesome", color: "text-hushh-blue" };
            return (
              <FeatureCard
                key={card.title}
                icon={mapped.icon}
                iconColor={mapped.color}
                title={card.title}
                description={card.description}
              />
            );
          })}
        </div>

        {/* ── Asset Focus ── */}
        <SectionLabel>{assetFocusSectionTitle}</SectionLabel>
        <p className="text-[11px] text-gray-400 font-light leading-relaxed mb-4">
          {assetFocusDescription}
        </p>
        <div className="space-y-3 mb-2">
          {assetPillars.map((pillar) => {
            const mapped = ASSET_ICONS[pillar.title] || { icon: "category", color: "text-hushh-blue" };
            return (
              <FeatureCard
                key={pillar.title}
                icon={mapped.icon}
                iconColor={mapped.color}
                title={pillar.title}
                description={pillar.description}
              />
            );
          })}
        </div>

        {/* ── Targeted Alpha Stack (FieldRow style) ── */}
        <SectionLabel>{alphaStackSectionTitle}</SectionLabel>
        <p className="text-[10px] text-gray-400 italic mb-1">
          {alphaStackSubtitle}
        </p>
        <div className="mb-2">
          {alphaStackRows.map((row) =>
            row.isTotalRow ? (
              <div
                key={row.label}
                className="flex items-center justify-between bg-ios-dark text-white rounded-2xl px-6 py-4 mt-3"
              >
                <span className="text-sm font-semibold">
                  {row.label}
                </span>
                <span
                  className="text-xl font-medium text-ios-green"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {row.value}
                </span>
              </div>
            ) : (
              <FieldRow key={row.label} label={row.label}>
                <span className="text-sm font-semibold text-black">
                  {row.value}
                </span>
              </FieldRow>
            )
          )}
        </div>

        {/* ── Risk Management ── */}
        <SectionLabel>{riskSectionTitle}</SectionLabel>
        <div className="space-y-3 mb-2">
          {riskCards.map((card) => {
            const mapped = RISK_ICONS[card.title] || { icon: "security", color: "text-hushh-blue" };
            return (
              <FeatureCard
                key={card.title}
                icon={mapped.icon}
                iconColor={mapped.color}
                title={card.title}
                description={card.description}
              />
            );
          })}
        </div>

        {/* ── Key Terms (FieldRow style) ── */}
        <SectionLabel>{keyTermsSectionTitle}</SectionLabel>
        <p className="text-[10px] text-gray-400 italic mb-1">
          {keyTermsSubtitle}
        </p>

        {/* First terms as FieldRows */}
        <div className="mb-4">
          {keyTerms.slice(0, 2).map((term) => (
            <FieldRow key={term.title} label={term.title}>
              <span className="text-[12px] font-medium text-black max-w-[180px] text-right leading-snug">
                {term.content}
              </span>
            </FieldRow>
          ))}
        </div>

        {/* Share Classes (compact cards) */}
        <SectionLabel>Share Classes</SectionLabel>
        <div className="space-y-3 mb-4">
          {shareClasses.map((sc) => (
            <div
              key={sc.shareClass}
              className="bg-ios-gray-bg border border-gray-200/60 rounded-2xl p-5 hover:border-hushh-blue/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-ios-dark flex items-center justify-center">
                    <span className="material-symbols-outlined text-white !text-[0.9rem]">
                      account_balance_wallet
                    </span>
                  </div>
                  <span className="text-[13px] font-semibold text-black">
                    {sc.shareClass}
                  </span>
                </div>
                <span className="text-[11px] font-medium text-hushh-blue bg-hushh-blue/10 px-2.5 py-1 rounded-full">
                  Min {sc.minInvestment}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-0.5">
                    Mgmt
                  </p>
                  <p className="text-[12px] font-semibold text-black">
                    {sc.managementFee}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-0.5">
                    Perf
                  </p>
                  <p className="text-[12px] font-semibold text-black">
                    {sc.performanceFee}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-0.5">
                    Hurdle
                  </p>
                  <p className="text-[12px] font-semibold text-black">
                    {sc.hurdleRate}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Remaining terms */}
        <div className="mb-6">
          {keyTerms.slice(2).map((term) => (
            <FieldRow key={term.title} label={term.title}>
              <span className="text-[12px] font-medium text-black max-w-[180px] text-right leading-snug">
                {term.content}
              </span>
            </FieldRow>
          ))}
        </div>

        {/* ── Join / CTA ── */}
        <section className="border-t border-gray-200 pt-8 mb-8">
          <h2
            className="text-[22px] font-medium text-black tracking-tight mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {joinSectionTitle}
          </h2>
          <p className="text-[13px] text-gray-400 font-light leading-relaxed mb-8 max-w-xs">
            {joinSectionDescription}
          </p>

          <div className="space-y-3">
            <HushhTechCta
              variant={HushhTechCtaVariant.BLACK}
              onClick={handleCompleteProfile}
            >
              {joinButtonLabel}
              <span className="material-symbols-outlined !text-[1.1rem]">
                arrow_forward
              </span>
            </HushhTechCta>
            <HushhTechCta
              variant={HushhTechCtaVariant.WHITE}
              onClick={() => navigate("/")}
            >
              Back to Home
            </HushhTechCta>
          </div>
        </section>

        {/* ── Disclaimer ── */}
        <p
          className="text-[9px] text-gray-400 text-center leading-relaxed italic max-w-xs mx-auto mb-4"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Investing involves risk, including possible loss of principal. Past
          performance does not guarantee future results. Hushh Technologies is an
          SEC registered investment advisor.
        </p>
      </main>

      {/* ═══ Footer Nav ═══ */}
      <HushhTechFooter
        activeTab={HushhFooterTab.FUND_A}
        onTabChange={(tab) => {
          if (tab === HushhFooterTab.HOME) navigate("/");
          if (tab === HushhFooterTab.FUND_A) navigate("/discover-fund-a");
          if (tab === HushhFooterTab.COMMUNITY) navigate("/community");
          if (tab === HushhFooterTab.PROFILE) navigate("/profile");
        }}
      />
    </div>
  );
};

export default FundA;
