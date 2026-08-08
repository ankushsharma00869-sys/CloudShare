import { ArrowUpCircle, Shield, Share2, CreditCard, FileText, Clock, Folder, History } from 'lucide-react'
import React from 'react'

const iconMap = { ArrowUpCircle, Shield, Share2, CreditCard, FileText, Clock, Folder, History }

const FeatureSection = ({ features }) => {
  return (
    <div style={{ background: 'var(--bg-surface)', padding: '100px 0', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-bright)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>Features</p>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-1px', marginBottom: '16px' }}>
            Everything you need
          </h2>
          <p style={{ fontSize: '18px', color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
            CloudShare gives you all the tools to manage and share your digital content.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {features.map((feature, index) => {
            const Icon = iconMap[feature.iconName] || FileText
            const colorMap = { 'text-purple-500': '#9d7fff', 'text-green-500': '#22c55e', 'text-orange-500': '#f97316', 'text-blue-500': '#60a5fa', 'text-red-500': '#ef4444' }
            const iconColor = colorMap[feature.iconColor] || '#9d7fff'
            return (
              <div key={index}
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px', transition: 'all 0.25s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 20px 40px var(--accent-glow)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: iconColor + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Icon size={22} color={iconColor} />
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>{feature.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default FeatureSection
