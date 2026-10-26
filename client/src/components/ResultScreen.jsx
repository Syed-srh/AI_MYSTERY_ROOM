import { motion } from 'framer-motion';
import { Trophy, Skull, RotateCcw, Award, FileQuestion } from 'lucide-react';

export default function ResultScreen({ success, culpritName, explanation, onPlayAgain }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16" style={{ background: 'var(--clr-bg)' }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
        className="w-full max-w-2xl"
      >
        {/* Header verdict badge */}
        <div
          className={`rounded-2xl p-8 text-center mb-6 shadow-2xl ${
            success ? 'badge-win' : 'badge-loss'
          }`}
        >
          <motion.div
            animate={{ rotate: success ? [0, -10, 10, -10, 0] : [0, 6, -6, 0] }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-6xl mb-4 flex justify-center"
          >
            {success ? <Trophy size={64} className="text-emerald-300 drop-shadow" /> : <Skull size={64} className="text-red-400 drop-shadow" />}
          </motion.div>
          <h1
            className="font-display text-3xl md:text-4xl mb-2 font-bold tracking-wider"
            style={{ color: success ? '#86efac' : '#fca5a5' }}
          >
            {success ? 'CASE SOLVED: JUSTICE SERVED' : 'VERDICT: WRONG SUSPECT'}
          </h1>
          <p className="font-ui text-base font-medium opacity-90 text-secondary">
            {success
              ? 'Your deduction was spot on. The culprit could not hide from your keen eye.'
              : 'The evidence pointed elsewhere. The true criminal slipped through your fingers.'}
          </p>
        </div>

        {/* Culprit Dossier Reveal */}
        <div className="card-gold p-6 md:p-8 mb-8 text-left">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-ui text-xs font-bold uppercase tracking-widest text-gold-light px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
              CONFIDENTIAL REPORT
            </span>
          </div>

          <h2 className="font-display text-2xl md:text-3xl text-gold glow-gold mb-4">
            The True Culprit: {culpritName}
          </h2>

          <hr className="divider-gold my-4" />

          <p className="font-ui text-xs font-bold uppercase tracking-wider text-muted mb-2">
            DETAILED CASE EXPLANATION & MOTIVE
          </p>
          <p className="font-body text-lg text-text leading-relaxed">
            {explanation}
          </p>
        </div>

        {/* Play Again CTA */}
        <div className="text-center">
          <button
            id="btn-play-again"
            type="button"
            className="btn btn-gold text-base py-3.5 px-8"
            onClick={onPlayAgain}
          >
            <RotateCcw size={18} />
            Start a New Mystery
          </button>
        </div>
      </motion.div>
    </div>
  );
}
