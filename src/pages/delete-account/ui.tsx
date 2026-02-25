/**
 * Delete Account Page — Follows Step 1–8 design philosophy exactly.
 * Playfair Display headings, all lowercase, black/white/gray palette,
 * icon-circle rows, HushhTechBackHeader, HushhTechCta, glassmorphism modal.
 * Logic stays in logic.ts — zero logic changes.
 */
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteAccountLogic } from "./logic";
import HushhTechBackHeader from "../../components/hushh-tech-back-header/HushhTechBackHeader";
import HushhTechCta, {
  HushhTechCtaVariant,
} from "../../components/hushh-tech-cta/HushhTechCta";
import DeleteAccountModal from "../../components/DeleteAccountModal";
import { Helmet } from "react-helmet";

/* ── Data items for deletion list ── */
const DELETION_ITEMS = [
  { icon: "person", label: "account credentials & profile" },
  { icon: "analytics", label: "investor profile & preferences" },
  { icon: "checklist", label: "onboarding data & responses" },
  { icon: "verified_user", label: "kyc verification data" },
  { icon: "chat", label: "chat history with ai assistant" },
  { icon: "folder", label: "uploaded documents & files" },
  { icon: "shield", label: "privacy settings & data vault" },
];

/* ── Retention policy items ── */
const RETENTION_ITEMS = [
  {
    icon: "bolt",
    title: "immediate",
    desc: "all personal data is deleted upon confirmation",
  },
  {
    icon: "schedule",
    title: "30 days",
    desc: "encrypted backups are purged within 30 days",
  },
  {
    icon: "gavel",
    title: "7 years",
    desc: "transaction records retained per financial regulations",
  },
  {
    icon: "analytics",
    title: "anonymized",
    desc: "aggregated analytics that cannot identify you may be kept",
  },
];

const DeleteAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    isOpen,
    onOpen,
    onClose,
    isLoggedIn,
    isLoading,
    userEmail,
    handleAccountDeleted,
    handleLoginRedirect,
  } = useDeleteAccountLogic();

  return (
    <>
      <Helmet>
        <title>Delete Account - Hushh</title>
        <meta
          name="description"
          content="Delete your Hushh account and remove all your personal data from our systems."
        />
      </Helmet>

      <div className="bg-white text-gray-900 min-h-screen antialiased flex flex-col selection:bg-black selection:text-white relative overflow-hidden">
        {/* ═══ Background layer (blurs when modal is open) ═══ */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            isOpen
              ? "scale-[0.98] blur-[2px] opacity-40 pointer-events-none select-none"
              : ""
          }`}
        >
          {/* ═══ Header ═══ */}
          <HushhTechBackHeader
            onBackClick={() => navigate(-1)}
            rightType="hamburger"
          />

          <main className="px-6 flex-grow max-w-md mx-auto w-full pb-16">
            {/* ── Title Section ── */}
            <section className="py-8">
              <h3 className="text-[11px] tracking-wide text-gray-500 lowercase mb-4 font-semibold">
                account settings
              </h3>
              <h1
                className="text-[2.75rem] leading-[1.1] font-normal text-black tracking-tight lowercase"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                delete your
                <br />
                <span className="text-gray-400 italic font-normal">
                  account
                </span>
              </h1>
              <p className="text-sm text-gray-500 mt-4 leading-relaxed lowercase font-medium">
                permanently remove your account and all associated data from our
                systems.
              </p>
            </section>

            {/* ── Session Status Row ── */}
            <section className="mb-2">
              {isLoading ? (
                <div className="flex items-center gap-4 py-5 border-b border-gray-200">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-black rounded-full" />
                  </div>
                  <p className="text-sm font-medium text-gray-700 lowercase">
                    checking session...
                  </p>
                </div>
              ) : isLoggedIn ? (
                <div className="flex items-center gap-4 py-5 border-b border-gray-200">
                  <div className="w-10 h-10 rounded-full bg-green-50 border border-green-200 flex items-center justify-center shrink-0">
                    <span
                      className="material-symbols-outlined text-green-600 text-lg"
                      style={{
                        fontVariationSettings: "'FILL' 1, 'wght' 600",
                      }}
                    >
                      check
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 lowercase">
                      logged in
                    </p>
                    {userEmail && (
                      <p className="text-xs text-gray-500 lowercase font-medium">
                        {userEmail}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 py-5 border-b border-gray-200">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <span
                      className="material-symbols-outlined text-gray-700 text-lg"
                      style={{ fontVariationSettings: "'wght' 400" }}
                    >
                      lock
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 lowercase">
                      login required
                    </p>
                    <p className="text-xs text-gray-500 lowercase font-medium">
                      please login to delete your account
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* ── What Gets Deleted ── */}
            <section className="mb-8">
              <h2
                className="text-xl font-normal text-black tracking-tight lowercase mb-1 pt-6"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                data that will be deleted
              </h2>
              <p className="text-xs text-gray-500 lowercase font-medium mb-5">
                the following data will be permanently removed
              </p>

              <div className="space-y-0">
                {DELETION_ITEMS.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 py-4 border-b border-gray-200"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <span
                        className="material-symbols-outlined text-gray-700 text-lg"
                        style={{ fontVariationSettings: "'wght' 400" }}
                      >
                        {item.icon}
                      </span>
                    </div>
                    <span className="text-sm text-gray-900 lowercase font-medium">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Retention Policy ── */}
            <section className="mb-8">
              <h2
                className="text-xl font-normal text-black tracking-tight lowercase mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                retention policy
              </h2>
              <p className="text-xs text-gray-500 lowercase font-medium mb-5">
                some data may be retained as required by law
              </p>

              <div className="space-y-0">
                {RETENTION_ITEMS.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 py-4 border-b border-gray-200"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <span
                        className="material-symbols-outlined text-gray-700 text-lg"
                        style={{ fontVariationSettings: "'wght' 400" }}
                      >
                        {item.icon}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 lowercase mb-0.5">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500 lowercase font-medium">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Need Help ── */}
            <section className="mb-8">
              <h2
                className="text-xl font-normal text-black tracking-tight lowercase mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                need help?
              </h2>
              <p className="text-xs text-gray-500 lowercase font-medium mb-5">
                if you're unable to access your account, contact us directly
              </p>

              <a
                href="mailto:support@hushh.ai"
                className="flex items-center gap-4 py-4 border-b border-gray-200 group"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0 group-hover:bg-gray-200 transition-colors">
                  <span
                    className="material-symbols-outlined text-gray-700 text-lg"
                    style={{ fontVariationSettings: "'wght' 400" }}
                  >
                    mail
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 lowercase">
                    support@hushh.ai
                  </p>
                  <p className="text-xs text-gray-500 lowercase font-medium">
                    general support
                  </p>
                </div>
              </a>

              <a
                href="mailto:privacy@hushh.ai"
                className="flex items-center gap-4 py-4 border-b border-gray-200 group"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0 group-hover:bg-gray-200 transition-colors">
                  <span
                    className="material-symbols-outlined text-gray-700 text-lg"
                    style={{ fontVariationSettings: "'wght' 400" }}
                  >
                    shield
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 lowercase">
                    privacy@hushh.ai
                  </p>
                  <p className="text-xs text-gray-500 lowercase font-medium">
                    privacy & data requests
                  </p>
                </div>
              </a>
            </section>

            {/* ── CTAs ── */}
            <section className="pb-12 space-y-3 mt-4">
              {isLoggedIn ? (
                <HushhTechCta
                  variant={HushhTechCtaVariant.BLACK}
                  onClick={onOpen}
                >
                  delete my account
                </HushhTechCta>
              ) : (
                <HushhTechCta
                  variant={HushhTechCtaVariant.BLACK}
                  onClick={handleLoginRedirect}
                >
                  login to continue
                </HushhTechCta>
              )}

              <HushhTechCta
                variant={HushhTechCtaVariant.WHITE}
                onClick={() => navigate("/")}
              >
                go to home
              </HushhTechCta>
            </section>

            {/* ── Trust Badges ── */}
            <section className="flex flex-col items-center justify-center text-center gap-2 pb-8">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px] text-gray-600">
                  lock
                </span>
                <span className="text-[10px] text-gray-600 tracking-wide uppercase font-medium">
                  256 bit encryption
                </span>
              </div>
              <p className="text-[10px] text-gray-400 lowercase">
                hushh technologies inc.
              </p>
            </section>
          </main>
        </div>

        {/* ═══ Delete Account Modal — Glassmorphism (matches Step 4 location modal) ═══ */}
        <DeleteAccountModal
          isOpen={isOpen}
          onClose={onClose}
          onAccountDeleted={handleAccountDeleted}
        />
      </div>
    </>
  );
};

export default DeleteAccountPage;
