import React from 'react';
import { assests } from '../../assets/assets';
import { ArrowRight, Link2 } from 'lucide-react';

const HeroSection = ({ openSignIn, openSignUp }) => (
  <div
    style={{
      background: 'var(--bg-base)',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {/* Subtle grid background */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage:
          'linear-gradient(var(--border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
        maskImage: 'linear-gradient(to bottom, black, transparent 85%)',
        pointerEvents: 'none',
      }}
    />

    <div
      style={{
        maxWidth: '1180px',
        margin: '0 auto',
        padding: '0 24px',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '48px',
          paddingTop: '96px',
          paddingBottom: '80px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            maxWidth: '680px',
            margin: '0 auto',
          }}
        >
          {/* Small label */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-pill)',
              padding: '6px 14px',
              marginBottom: 'var(--space-6)',
            }}
          >
            <Link2 size={13} color="var(--accent-bright)" />

            <span
              style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                fontWeight: 500,
              }}
            >
              Every upload gets a shareable link
            </span>
          </div>

          {/* Main heading */}
          <h1
            style={{
              fontSize: 'clamp(36px, 5vw, 56px)',
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-5)',
            }}
          >
            Manage and share your files easily.
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: '17px',
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              marginBottom: 'var(--space-8)',
            }}
          >
            Upload your files, keep them organized, and share them whenever
            you need. CloudShare gives you a simple way to manage your files
            and control how they are shared.
          </p>

          {/* Buttons */}
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-3)',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            {/* Create account */}
            <button
              onClick={() => openSignUp()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--accent)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-btn)',
                padding: '12px 22px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background var(--duration) var(--ease)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  'var(--accent-bright)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--accent)';
              }}
            >
              Create free account
              <ArrowRight size={16} />
            </button>

            {/* Sign in */}
            <button
              onClick={() => openSignIn()}
              style={{
                background: 'transparent',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-btn)',
                padding: '12px 22px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background var(--duration) var(--ease)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  'var(--bg-elevated)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              Sign in
            </button>
          </div>
        </div>

        {/* Product preview */}
        <div
          style={{
            position: 'relative',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            border: '1px solid var(--border)',
            maxWidth: '980px',
            margin: '16px auto 0',
            boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
          }}
        >
          <img
            src={assests.dashboard}
            alt="CloudShare file dashboard"
            style={{
              width: '100%',
              display: 'block',
            }}
          />
        </div>
      </div>
    </div>
  </div>
);

export default HeroSection;

