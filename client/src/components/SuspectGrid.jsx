import { motion } from 'framer-motion';
import { CheckCircle2, ShieldAlert } from 'lucide-react';

export default function SuspectGrid({ suspects = [], selected, onSelect }) {
  // Helper to extract 1 or 2 clean initials without overflowing
  const getInitials = (name = '') => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return (name[0] || '?').toUpperCase();
  };

  return (
    <div className="flex flex-col gap-4">
      {suspects.map((s, i) => {
        const isSelected = selected === s.id;
        return (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`suspect-card ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelect(s.id)}
            id={`suspect-${s.id}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelect(s.id)}
          >
            {/* Header: Avatar + Full Name + Status */}
            <div className="flex items-center gap-3.5 mb-3">
              <div
                className="w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center font-display font-bold text-base transition-colors"
                style={{
                  background: isSelected
                    ? 'linear-gradient(135deg, var(--clr-crimson-l), #7e1728)'
                    : 'rgba(212, 175, 55, 0.12)',
                  border: `1.5px solid ${isSelected ? 'var(--clr-crimson-l)' : 'rgba(212, 175, 55, 0.4)'}`,
                  color: isSelected ? '#ffffff' : 'var(--clr-gold-light)',
                  boxShadow: isSelected ? '0 0 14px rgba(217,56,83,0.5)' : 'none',
                }}
              >
                {getInitials(s.name)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3
                    className="font-display text-base md:text-lg font-semibold tracking-wide"
                    style={{ color: isSelected ? '#fca5a5' : 'var(--clr-text)' }}
                  >
                    {s.name}
                  </h3>
                  {isSelected && (
                    <span className="inline-flex items-center gap-1 font-ui text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-500/50 text-red-300">
                      <CheckCircle2 size={12} /> ACCUSED
                    </span>
                  )}
                </div>
                <p className="font-ui text-xs text-muted">Click card to select</p>
              </div>
            </div>

            {/* Description */}
            {s.description && (
              <p className="font-body text-base text-secondary mb-3 leading-relaxed text-left">
                {s.description}
              </p>
            )}

            {/* Motive Box */}
            <div
              className="rounded-lg p-3 text-left transition-colors"
              style={{
                background: isSelected ? 'rgba(155, 35, 53, 0.12)' : 'rgba(10, 10, 16, 0.5)',
                border: `1px solid ${isSelected ? 'rgba(217, 56, 83, 0.35)' : 'var(--clr-border)'}`,
              }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="font-ui text-xs font-bold uppercase tracking-wider text-gold-light">
                  MOTIVE
                </span>
              </div>
              <p className="font-body text-base text-text leading-snug">
                {s.motive}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
