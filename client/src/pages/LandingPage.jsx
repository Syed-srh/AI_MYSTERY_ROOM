import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Sparkles, ChevronRight } from 'lucide-react';
import { generateMystery } from '../api/mystery';

const EXAMPLES = [
  'A tech billionaire\'s prototype was stolen at a gala',
  'A priceless painting vanished from a London museum during a charity auction',
  'The head chef of a Michelin-star restaurant was found dead the night before the Oscars',
  'A royal family jewel disappeared from a locked vault with no signs of forced entry',
];

export default function LandingPage() {
  const [scenario, setScenario]   = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (scenario.trim().length < 5) {
      setError('Please enter a more detailed scenario (at least 5 characters).');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { data } = await generateMystery(scenario);
      navigate(`/investigation/${data.mysteryId}`, { state: { scenario } });
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: 'var(--clr-bg)' }}>
      {/* Background atmospheric elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-10"
          style={{ background: 'radial-gradient(circle, var(--clr-gold) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-3xl opacity-8"
          style={{ background: 'radial-gradient(circle, var(--clr-crimson) 0%, transparent 70%)' }}
        />
        {/* Decorative lines */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-px opacity-5"
            style={{
              height: '100%',
              left: `${10 + i * 20}%`,
              background: 'linear-gradient(to bottom, transparent, var(--clr-gold), transparent)',
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-20 w-full border-b border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl shadow-inner shadow-amber-500/10">
              <span className="animate-flicker">🕯️</span>
            </div>
            <div>
              <span className="font-display text-base md:text-lg font-bold tracking-[0.22em] text-gold glow-gold block leading-tight">
                AI MYSTERY ROOM
              </span>
              <span className="font-ui text-[10px] tracking-widest uppercase text-muted block mt-0.5">
                Interactive Case Generator
              </span>
            </div>
          </div>

          {/* <div className="hidden sm:flex items-center gap-2 font-ui text-xs text-muted px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-secondary font-medium">System Ready</span>
          </div> */}
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full font-ui text-xs tracking-widest"
            style={{ border: '1px solid rgba(201,168,76,0.3)', color: 'var(--clr-gold)', background: 'rgba(201,168,76,0.05)' }}>
            <Sparkles size={12} />
            AI-GENERATED DETECTIVE CHALLENGES
          </div>

          <h1 className="font-display text-5xl md:text-7xl mb-4 leading-tight glow-gold" style={{ color: 'var(--clr-gold)' }}>
            The Mystery<br />
            <span className="text-4xl md:text-6xl" style={{ color: 'var(--clr-text)' }}>
              Awaits Your Verdict
            </span>
          </h1>

          <p className="font-body text-lg md:text-xl text-muted mb-10 max-w-xl mx-auto">
            Describe any scenario. Our AI will craft a full detective case — suspects, motives, clues, and a hidden culprit. Can you crack it?
          </p>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
            <div className="card-gold p-2 mb-5">
              <textarea
                id="scenario-input"
                className="mystery-input"
                placeholder="e.g. A famous novelist is found dead in her locked study the night before her most controversial book is published..."
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                disabled={loading}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-950/40 border border-red-500/40 rounded-lg p-3 text-red-300 font-ui text-sm mb-5 flex items-center justify-center gap-2"
              >
                <span>⚠️</span>
                <span>{error}</span>
              </motion.div>
            )}

            <button
              id="btn-generate"
              type="submit"
              className="btn btn-gold w-full text-base py-4"
              disabled={loading || !scenario.trim()}
            >
              {loading ? (
                <><span className="spinner w-5 h-5 border-2" style={{ borderTopColor: '#0a0a0f' }} /> Generating Case...</>
              ) : (
                <><Search size={19} /> Open the Investigation</>
              )}
            </button>
          </form>

          {/* Example prompts */}
          <div className="mt-12 w-full max-w-2xl mx-auto">
            <p className="font-ui text-xs font-bold text-muted uppercase tracking-widest mb-4">
              Or Try One of These Scenarios
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {EXAMPLES.map((ex, i) => (
                <button
                  key={i}
                  type="button"
                  className="scenario-card"
                  onClick={() => setScenario(ex)}
                  disabled={loading}
                >
                  <ChevronRight size={16} className="flex-shrink-0 text-gold mt-1" />
                  <span>{ex}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center">
        <p className="font-ui text-xs text-muted opacity-40">
          Every case is uniquely generated by AI. No two mysteries are alike.
        </p>
      </footer>
    </div>
  );
}
