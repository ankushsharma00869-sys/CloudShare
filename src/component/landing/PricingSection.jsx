import { Check } from 'lucide-react'
import React from 'react'

const PricingSection = ({ pricingPlans, openSignUp }) => {
  return (
    <div style={{ background: 'var(--bg-base)', padding: 'var(--space-24) 0', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ marginBottom: 'var(--space-12)', maxWidth: '520px' }}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-bright)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 'var(--space-3)' }}>Pricing</p>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 38px)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em', marginBottom: 'var(--space-3)' }}>
            Pay for credits, not a subscription tier
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Upload and share actions use credits. Buy more when you need them.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-5)', alignItems: 'stretch' }}>
          {pricingPlans.map((plan, index) => (
            <div key={index}
              style={{
                background: 'var(--bg-card)',
                border: plan.highlighted ? '1px solid var(--accent)' : '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-8)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
              }}>
              {plan.highlighted && (
                <div style={{ position: 'absolute', top: '-11px', left: 'var(--space-8)', background: 'var(--accent)', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '3px 12px', borderRadius: 'var(--radius-pill)', letterSpacing: '0.03em' }}>
                  MOST POPULAR
                </div>
              )}
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>{plan.name}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: 'var(--space-5)' }}>{plan.description}</p>
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <span style={{ fontSize: '40px', fontWeight: 700, color: 'var(--text-primary)' }}>{plan.price}</span>
                {plan.price !== '₹0' && <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>/month</span>}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', flex: 1 }}>
                {plan.features.map((feature, fi) => (
                  <li key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    <Check size={15} color="var(--accent-bright)" style={{ marginTop: '2px', flexShrink: 0 }} strokeWidth={2} />
                    {feature}
                  </li>
                ))}
              </ul>
              <button onClick={() => openSignUp()}
                style={{
                  width: '100%', padding: '12px', borderRadius: 'var(--radius-btn)', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: `background var(--duration) var(--ease)`,
                  background: plan.highlighted ? 'var(--accent)' : 'var(--bg-elevated)',
                  color: plan.highlighted ? '#fff' : 'var(--text-primary)',
                  border: plan.highlighted ? 'none' : '1px solid var(--border-strong)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = plan.highlighted ? 'var(--accent-bright)' : 'var(--bg-card)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = plan.highlighted ? 'var(--accent)' : 'var(--bg-elevated)'; }}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PricingSection
