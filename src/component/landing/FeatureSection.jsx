import { ArrowUpCircle, Shield, Share2, CreditCard, FileText, Clock, Folder, History } from 'lucide-react'
import React from 'react'

const iconMap = { ArrowUpCircle, Shield, Share2, CreditCard, FileText, Clock, Folder, History }

const FeatureSection = ({ features }) => {
  return (
    <div style={{ background: 'var(--bg-surface)', padding: 'var(--space-24) 0', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ marginBottom: 'var(--space-12)', maxWidth: '520px' }}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-bright)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 'var(--space-3)' }}>What's included</p>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 38px)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em', marginBottom: 'var(--space-3)' }}>
            Built around uploading and sharing
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Six things CloudShare actually does, not a features list padded for length.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          {features.map((feature, index) => {
            const Icon = iconMap[feature.iconName] || FileText
            return (
              <div key={index}
                style={{ background: 'var(--bg-card)', padding: 'var(--space-8)', transition: `background var(--duration) var(--ease)` }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; }}>
                <Icon size={20} color="var(--accent-bright)" strokeWidth={1.75} style={{ marginBottom: 'var(--space-4)' }} />
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>{feature.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default FeatureSection
