import { motion } from 'framer-motion';
import { MessageSquare, Camera, Search, User, ShieldCheck } from 'lucide-react';

const TABS = [
  { id: 'messages',  label: 'Interception Logs', shortLabel: 'Messages',      icon: MessageSquare },
  { id: 'camera',    label: 'Camera Feeds',      shortLabel: 'Camera Feeds',  icon: Camera },
  { id: 'physical', label: 'Physical Clues',    shortLabel: 'Physical Clues',icon: Search },
];

export default function EvidenceTabs({ active, onChange }) {
  return (
    <div className="flex gap-2 border-b border-subtle pb-0">
      {TABS.map(({ id, label, icon: Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            id={`tab-${id}`}
            type="button"
            className={`tab ${isActive ? 'active' : ''}`}
            onClick={() => onChange(id)}
          >
            <Icon
              size={15}
              className={`transition-colors ${isActive ? 'text-gold' : 'text-muted'}`}
            />
            <span className="font-ui tracking-wider">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ── WhatsApp Log Panel ────────────────────────────────────────────── */
export function WhatsappPanel({ logs }) {
  if (!logs?.length) return <EmptyState text="No intercepted messages found in this case." />;

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-subtle">
        <span className="font-ui text-xs font-bold text-muted uppercase tracking-widest">
          Wiretap & Encrypted Chat Transcripts
        </span>
        <span className="font-ui text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
          <ShieldCheck size={13} /> Authenticated
        </span>
      </div>

      <div className="space-y-4 pt-1">
        {logs.map((log, i) => {
          // Even indexes as primary sender, odd as recipient response
          const isSent = i % 2 === 0;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex flex-col ${isSent ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-lg w-full sm:w-auto p-4 rounded-xl ${
                  isSent ? 'chat-bubble-sent' : 'chat-bubble-recv'
                }`}
              >
                {/* Sender/Receiver Meta */}
                <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-white/10">
                  <div className="flex items-center gap-1.5">
                    <User size={12} className={isSent ? 'text-emerald-300' : 'text-gold'} />
                    <span
                      className="font-ui text-xs font-bold tracking-wide"
                      style={{ color: isSent ? '#86efac' : 'var(--clr-gold-light)' }}
                    >
                      {log.sender}
                    </span>
                    <span className="font-ui text-xs text-secondary">
                      → {log.receiver}
                    </span>
                  </div>
                </div>

                {/* Message Body */}
                <p className="font-body text-base md:text-lg leading-relaxed text-text">
                  {log.message}
                </p>

                {/* Clear legible timestamp */}
                <div className="mt-2 text-right">
                  <span className="font-ui text-xs font-medium text-muted">
                    {log.timestamp}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Camera Feed Panel ─────────────────────────────────────────────── */
export function CameraPanel({ recordings }) {
  if (!recordings?.length) return <EmptyState text="No security camera recordings available." />;

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-subtle">
        <span className="font-ui text-xs font-bold text-muted uppercase tracking-widest">
          Security Surveillance Logs
        </span>
        <span className="font-ui text-xs text-red-400 font-semibold tracking-wider flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> LIVE TIMELINES
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {recordings.map((rec, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            className="cam-feed p-5 flex flex-col justify-between"
          >
            {/* Camera feed top header */}
            <div className="flex items-center justify-between gap-2 mb-3 relative z-10 border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-sm shadow-red-500" />
                <span className="font-ui text-xs font-bold tracking-widest text-red-400">REC</span>
                <span className="font-ui text-xs font-semibold text-secondary">
                  CAM {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="font-ui text-xs font-medium text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                ⏱ {rec.timestamp}
              </div>
            </div>

            {/* Description */}
            <p className="font-body text-base text-text relative z-10 leading-relaxed text-left flex-1">
              {rec.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── Physical Clues Panel ──────────────────────────────────────────── */
export function PhysicalCluesPanel({ images }) {
  if (!images?.length) return <EmptyState text="No physical forensic evidence cataloged." />;

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-subtle">
        <span className="font-ui text-xs font-bold text-muted uppercase tracking-widest">
          Forensic & Scene Evidence
        </span>
        <span className="font-ui text-xs text-gold-light font-semibold">
          {images.length} ITEMS CATALOGED
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {images.map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="card p-5 flex items-start gap-4 hover:border-gold transition-colors"
          >
            {/* Evidence badge/icon */}
            <div
              className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-inner"
              style={{
                background: 'rgba(212, 175, 55, 0.12)',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                color: 'var(--clr-gold-light)',
              }}
            >
              🔍
            </div>

            <div className="flex-1 text-left">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-ui text-xs font-bold uppercase tracking-wider text-gold-light">
                  Evidence #{String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-ui text-xs text-muted">Forensics</span>
              </div>
              <p className="font-body text-base text-text leading-relaxed">
                {img.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-muted font-ui text-base gap-2">
      <span className="text-3xl opacity-60">📁</span>
      <p>{text}</p>
    </div>
  );
}
