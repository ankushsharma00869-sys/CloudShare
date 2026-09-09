import React from "react";
import { ArrowRight } from "lucide-react";

const CTASection = ({ openSignUp }) => (
  <div style={{ background: 'var(--bg-base)', borderTop: '1px solid var(--border)', padding: 'var(--space-24) 0' }}>
    <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 24px' }}>
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-16) var(--space-8)', textAlign: 'center',
      }}>
        <h2 style={{ fontSize: 'clamp(26px, 3vw, 34px)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em', marginBottom: 'var(--space-3)' }}>
          Start uploading, free
        </h2>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto var(--space-8)', lineHeight: 1.6 }}>
          Every new account starts with free credits — enough to try uploads and share links before you decide to buy more.
        </p>
        <button onClick={() => openSignUp?.()} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-btn)', padding: '13px 26px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', transition: `background var(--duration) var(--ease)` }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-bright)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)'; }}>
          Create free account <ArrowRight size={16} />
        </button>
      </div>
    </div>
  </div>
);

export default CTASection;
