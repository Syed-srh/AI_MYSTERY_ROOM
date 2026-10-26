import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  'Analyzing scenario...',
  'Developing suspects...',
  'Planting clues...',
  'Reviewing evidence trail...',
  'Sealing the case file...',
];

export default function GeneratingLoader({ scenario }) {
  const [stepIndex, setStepIndex] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => {
      setStepIndex((i) => (i + 1) % steps.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: 'var(--clr-bg)' }}>
      {/* Atmospheric rings */}
      <div className="relative flex items-center justify-center mb-10">
        {[80, 120, 160].map((size, i) => (
          <motion.div
            key={size}
            className="absolute rounded-full border"
            style={{
              width: size,
              height: size,
              borderColor: `rgba(201,168,76,${0.15 - i * 0.04})`,
            }}
            animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
        <div className="spinner" />
      </div>

      <motion.h2
        className="font-display text-2xl text-gold glow-gold mb-2 text-center"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        The Detective Files Are Being Prepared
      </motion.h2>

      <p className="text-muted font-ui text-sm mb-8 text-center" style={{ maxWidth: 420 }}>
        Our AI is constructing your case. This takes about 15–30 seconds.
      </p>

      {/* Scenario reminder */}
      <div className="card px-6 py-4 mb-8 text-center" style={{ maxWidth: 480 }}>
        <p className="text-muted font-ui text-xs uppercase tracking-widest mb-1">Your Scenario</p>
        <p className="font-body text-base" style={{ color: 'var(--clr-text)' }}>"{scenario}"</p>
      </div>

      {/* Animated step text */}
      <motion.div
        key={stepIndex}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="flex items-center gap-3"
      >
        <span className="w-2 h-2 rounded-full bg-gold animate-pulse-gold" />
        <span className="font-ui text-sm text-muted">{steps[stepIndex]}</span>
      </motion.div>

      {/* Decorative dots at bottom */}
      <div className="flex gap-2 mt-10">
        {steps.map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full transition-all duration-500"
            style={{
              background: i === stepIndex ? 'var(--clr-gold)' : 'var(--clr-border)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
