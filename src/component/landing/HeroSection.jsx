import React from 'react'
import { assests } from '../../assets/assets';
import { ArrowRight, Shield, Zap, Globe } from 'lucide-react';

const HeroSection = ({ openSignIn, openSignUp }) => (
  <div style={{ background: 'var(--bg-base)', position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    {/* Glow orbs */}
    <div style={{ position: 'absolute', top: '-200px', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '600px', background: 'radial-gradient(ellipse at center, #7c5cfc18 0%, transparent 70%)', pointerEvents: 'none' }} />
    <div style={{ position: 'absolute', top: '40%', right: '-100px', width: '400px', height: '400px', background: 'radial-gradient(ellipse, #7c5cfc0a 0%, transparent 70%)', pointerEvents: 'none' }} />

    {/* Grid pattern */}
    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(var(--border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)', backgroundSize: '60px 60px', maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)', pointerEvents: 'none' }} />

    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 10 }}>
      <div style={{ textAlign: 'center', paddingTop: '80px', paddingBottom: '64px' }}>
        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--accent-dim)', border: '1px solid var(--accent)', borderRadius: '100px', padding: '6px 16px', marginBottom: '32px' }}>
          <Shield size={14} color='var(--accent-bright)' />
          <span style={{ fontSize: '13px', color: 'var(--accent-bright)', fontWeight: 500 }}>Enterprise-grade security</span>
        </div>

        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(42px, 6vw, 80px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-2px', marginBottom: '24px' }}>
          <span style={{ color: 'var(--text-primary)', display: 'block' }}>Share files with</span>
          <span style={{ background: 'linear-gradient(135deg, #7c5cfc, #c084fc, #7c5cfc)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent', display: 'block', backgroundSize: '200% 200%' }}>zero compromise.</span>
        </h1>

        <p style={{ fontSize: '18px', color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto 40px', lineHeight: 1.7 }}>
          Upload, manage, and share your files with military-grade encryption. Accessible anywhere, anytime, with a credit-based system that scales with you.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '64px' }}>
          <button onClick={() => openSignUp()} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '12px', padding: '14px 28px', fontSize: '16px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 0 30px var(--accent-glow)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-bright)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            Get started free <ArrowRight size={18} />
          </button>
          <button onClick={() => openSignIn()} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-strong)', borderRadius: '12px', padding: '14px 28px', fontSize: '16px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            Sign in
          </button>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap', marginBottom: '64px' }}>
          {[['99.9%', 'Uptime'], ['256-bit', 'Encryption'], ['10x', 'Faster Sharing']].map(([val, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '28px', fontWeight: 700, color: 'var(--accent-bright)' }}>{val}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Dashboard preview */}
        <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 40px 120px #7c5cfc15, 0 0 0 1px var(--border)' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, var(--bg-base) 100%)', zIndex: 2, pointerEvents: 'none' }} />
          <img src={assests.dashboard} alt="CloudShare Dashboard" style={{ width: '100%', display: 'block', opacity: 0.85 }} />
        </div>
      </div>
    </div>
  </div>
)

export default HeroSection;
