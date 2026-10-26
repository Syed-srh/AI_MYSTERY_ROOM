import { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Users, BookOpen, AlertTriangle, ArrowLeft, Gavel, Sparkles } from 'lucide-react';

import { useMysteryPolling } from '../hooks/useMysteryPolling';
import { accuseSuspect } from '../api/mystery';
import GeneratingLoader from '../components/GeneratingLoader';
import EvidenceTabs, { WhatsappPanel, CameraPanel, PhysicalCluesPanel } from '../components/EvidenceTabs';
import SuspectGrid from '../components/SuspectGrid';
import ResultScreen from '../components/ResultScreen';

export default function InvestigationPage() {
  const { id }         = useParams();
  const location       = useLocation();
  const navigate       = useNavigate();
  const scenario       = location.state?.scenario ?? 'Your mystery';

  const { mystery, error: pollError } = useMysteryPolling(id);

  const [activeTab, setActiveTab]     = useState('messages');
  const [selected, setSelected]       = useState(null);
  const [accusing, setAccusing]       = useState(false);
  const [result, setResult]           = useState(null);
  const [accuseError, setAccuseError] = useState('');

  /* ── Loading / Generating state ─────────────────────────────────── */
  if (!mystery || mystery.status === 'generating') {
    if (pollError) {
      return <ErrorScreen error={pollError} onBack={() => navigate('/')} />;
    }
    return <GeneratingLoader scenario={scenario} />;
  }

  if (mystery.status === 'failed') {
    return (
      <ErrorScreen
        error="The AI failed to generate your case. Please try a different scenario."
        onBack={() => navigate('/')}
      />
    );
  }

  /* ── Result screen ───────────────────────────────────────────────── */
  if (result) {
    return (
      <ResultScreen
        success={result.success}
        culpritName={result.culpritName}
        explanation={result.explanation}
        onPlayAgain={() => navigate('/')}
      />
    );
  }

  /* ── Accuse handler ──────────────────────────────────────────────── */
  const handleAccuse = async () => {
    if (!selected) {
      setAccuseError('Please select a suspect from the list before accusing.');
      return;
    }
    setAccuseError('');
    setAccusing(true);
    try {
      const { data } = await accuseSuspect(id, selected);
      setResult(data);
    } catch (err) {
      setAccuseError(err.response?.data?.error || 'Failed to submit accusation.');
    } finally {
      setAccusing(false);
    }
  };

  const evidencePanels = {
    messages: <WhatsappPanel logs={mystery.evidence?.whatsappLogs} />,
    camera:   <CameraPanel recordings={mystery.evidence?.camRecordings} />,
    physical: <PhysicalCluesPanel images={mystery.evidence?.images} />,
  };

  const selectedSuspectObj = mystery.suspects?.find((s) => s.id === selected);

  return (
    <div className="min-h-screen pb-16" style={{ background: 'var(--clr-bg)' }}>
      {/* Top Navigation */}
      <header
        className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{
          background: 'rgba(10, 10, 16, 0.9)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--clr-border)',
        }}
      >
        <button
          id="btn-back"
          type="button"
          className="btn btn-ghost text-xs py-2 px-4"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={15} /> Back to Home
        </button>

        <div className="flex items-center gap-2">
          <span className="animate-flicker text-lg">🕯️</span>
          <span className="font-display text-sm tracking-widest text-gold font-bold">CASE DOSSIER</span>
        </div>

        <div className="font-ui text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> ACTIVE INVESTIGATION
        </div>
      </header>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        {/* Case Brief Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-gold p-6 md:p-8 mb-8"
        >
          <div className="flex items-start gap-4 mb-4">
            <div
              className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner"
              style={{
                background: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid var(--clr-gold)',
                color: 'var(--clr-gold-light)',
              }}
            >
              <BookOpen size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-ui text-xs font-bold uppercase tracking-widest text-gold-light px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                  CASE BRIEF
                </span>
              </div>
              <h1 className="font-display text-2xl md:text-3xl text-gold glow-gold tracking-wide leading-snug">
                {mystery.userScenario}
              </h1>
            </div>
          </div>

          <hr className="divider-gold my-4" />

          {/* Narrative storyline with generous line-height and padding */}
          <p className="font-body text-lg md:text-xl text-text leading-relaxed text-left">
            {mystery.storyline}
          </p>
        </motion.div>

        {/* 62% / 38% Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Evidence Files (~62% width, col-span-7 or 8 on large screens) */}
          <div className="lg:col-span-7 xl:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-gold">
                    <FileText size={18} />
                  </div>
                  <h2 className="font-display text-xl font-bold tracking-wider text-gold">
                    EVIDENCE FILES
                  </h2>
                </div>
                <span className="font-ui text-xs font-semibold text-muted uppercase tracking-wider">
                  Select Tab Below
                </span>
              </div>

              {/* Tabs */}
              <div>
                <EvidenceTabs active={activeTab} onChange={setActiveTab} />
              </div>

              {/* Tab Content Container */}
              <div
                className="card min-h-[420px] p-0 overflow-hidden"
                style={{ borderTopLeftRadius: 0 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {evidencePanels[activeTab]}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Right: Suspects & Accusation (~38% width, col-span-5) */}
          <div className="lg:col-span-5 xl:col-span-5 space-y-6">
            {/* Suspects Header */}
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-gold">
                    <Users size={18} />
                  </div>
                  <h2 className="font-display text-xl font-bold tracking-wider text-gold">
                    SUSPECTS
                  </h2>
                </div>
                <span className="font-ui text-xs font-semibold text-muted">
                  {mystery.suspects?.length || 0} PERSONS OF INTEREST
                </span>
              </div>

              {/* Suspects Vertical Stack */}
              <SuspectGrid
                suspects={mystery.suspects}
                selected={selected}
                onSelect={setSelected}
              />
            </motion.div>

            {/* Accusation Box */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="card p-6"
              style={{
                border: selected ? '1.5px solid var(--clr-crimson-l)' : '1px solid var(--clr-border)',
                background: selected
                  ? 'linear-gradient(180deg, rgba(28, 20, 26, 0.95), rgba(18, 16, 22, 0.98))'
                  : 'var(--clr-card)',
              }}
            >
              <div className="flex items-center gap-2.5 mb-3">
                <Gavel size={18} className="text-crimson" />
                <h3 className="font-display text-lg font-bold text-crimson tracking-wider">
                  MAKE YOUR ACCUSATION
                </h3>
              </div>

              {selected ? (
                <div className="bg-red-950/30 border border-red-500/30 rounded-lg p-3.5 mb-4 text-left">
                  <p className="font-ui text-xs font-bold uppercase tracking-wider text-muted mb-1">
                    Prime Accused:
                  </p>
                  <p className="font-display text-lg font-bold text-red-200">
                    {selectedSuspectObj?.name}
                  </p>
                </div>
              ) : (
                <p className="font-body text-base text-muted mb-4 italic text-left">
                  Review the evidence files, click on the prime suspect from the list above, and make your formal accusation.
                </p>
              )}

              {accuseError && (
                <div className="bg-red-950/60 border border-red-500/50 rounded-lg p-3 text-red-300 font-ui text-xs mb-4 flex items-center gap-2">
                  <AlertTriangle size={14} className="flex-shrink-0" />
                  <span>{accuseError}</span>
                </div>
              )}

              <button
                id="btn-accuse"
                type="button"
                className="btn btn-crimson w-full py-3.5 text-base"
                onClick={handleAccuse}
                disabled={!selected || accusing}
              >
                {accusing ? (
                  <><span className="spinner w-5 h-5 border-2" /> Submitting Verdict...</>
                ) : (
                  <><Gavel size={18} /> Accuse & Reveal Culprit</>
                )}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorScreen({ error, onBack }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center" style={{ background: 'var(--clr-bg)' }}>
      <div className="text-6xl mb-4 animate-bounce">🚨</div>
      <h2 className="font-display text-3xl text-gold glow-gold mb-3">Something Went Wrong</h2>
      <p className="font-body text-lg text-secondary mb-8 max-w-lg leading-relaxed">{error}</p>
      <button id="btn-back-error" type="button" className="btn btn-gold" onClick={onBack}>
        <ArrowLeft size={16} /> Return to Home
      </button>
    </div>
  );
}
