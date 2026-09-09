import { Zap } from 'lucide-react';
import React from 'react'

const CreditsDisplay = ({ credits }) => {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      background: 'var(--bg-elevated)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-pill)', padding: '6px 12px',
    }}>
      <Zap size={13} color="var(--accent-bright)" strokeWidth={2} />
      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{credits}</span>
      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>credits</span>
    </div>
  )
}

export default CreditsDisplay;
