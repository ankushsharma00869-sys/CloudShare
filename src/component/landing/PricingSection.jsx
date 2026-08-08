import { Check, Zap } from 'lucide-react'
import React, { useState } from 'react'

const PricingSection = ({ pricingPlans, openSignUp }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  return (
    <div style={{ background: 'var(--bg-base)', padding: '100px 0', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-bright)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>Pricing</p>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-1px', marginBottom: '16px' }}>
            Simple, transparent pricing
          </h2>
          <p style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>Choose the plan that fits your needs</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'start' }}>
          {pricingPlans.map((plan, index) => {
            const isHovered = hoveredIndex === index
            const baseScale = plan.highlighted ? 1.03 : 1
            const hoverScale = baseScale + 0.015

            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  background: plan.highlighted ? 'linear-gradient(145deg, var(--bg-elevated), var(--bg-card))' : 'var(--bg-card)',
                  border: plan.highlighted ? '1px solid var(--accent)' : isHovered ? '1px solid var(--border-strong)' : '1px solid var(--border)',
                  borderRadius: '20px',
                  padding: '32px',
                  position: 'relative',
                  transform: isHovered ? `translateY(-6px) scale(${hoverScale})` : `translateY(0) scale(${baseScale})`,
                  boxShadow: isHovered
                    ? plan.highlighted
                      ? '0 40px 90px var(--accent-glow), 0 12px 30px rgba(0,0,0,0.35)'
                      : '0 24px 60px rgba(0,0,0,0.28), 0 8px 20px rgba(0,0,0,0.18)'
                    : plan.highlighted
                      ? '0 30px 80px var(--accent-glow)'
                      : '0 0px 0px rgba(0,0,0,0)',
                  transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.25s ease',
                  willChange: 'transform, box-shadow',
                }}>
                {plan.highlighted && (
                  <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent)', color: '#fff', fontSize: '12px', fontWeight: 700, padding: '4px 16px', borderRadius: '100px', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Zap size={12} /> MOST POPULAR
                  </div>
                )}
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>{plan.name}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>{plan.description}</p>
                <div style={{ marginBottom: '28px' }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '48px', fontWeight: 700, color: plan.highlighted ? 'var(--accent-bright)' : 'var(--text-primary)' }}>{plan.price}</span>
                  {plan.price !== '₹0' && <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>/month</span>}
                </div>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {plan.features.map((feature, fi) => (
                    <li key={fi} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--green-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Check size={12} color='var(--green)' />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button onClick={() => openSignUp()}
                  style={{
                    width: '100%', padding: '14px', borderRadius: '12px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', border: 'none', transition: 'all 0.2s',
                    background: plan.highlighted ? 'var(--accent)' : 'var(--bg-elevated)',
                    color: plan.highlighted ? '#fff' : 'var(--text-primary)',
                    border: plan.highlighted ? 'none' : '1px solid var(--border-strong)'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  {plan.cta}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default PricingSection
