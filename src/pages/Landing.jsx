import React from 'react'
import { Share2Icon } from 'lucide-react';
import HeroSection from '../component/landing/HeroSection';
import FeatureSection from '../component/landing/FeatureSection';
import PricingSection from '../component/landing/PricingSection';
import TestimonialSection from '../component/landing/TestimonialSection';
import CTASection from '../component/landing/CTASection';
import Footer from '../component/landing/FooterSection';
import { features, pricingPlans, testimonials } from '../assets/data';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  // These replace Clerk's openSignIn()/openSignUp() modal triggers - we just
  // navigate to our own /login and /register pages instead.
  const openSignIn = () => navigate('/login');
  const openSignUp = () => navigate('/register');
  useEffect(() => { if (isAuthenticated) navigate("/dashboard"); }, [isAuthenticated, navigate]);

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      {/* Landing Navbar */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', position: 'sticky', top: 0, zIndex: 50, background: 'color-mix(in srgb, var(--bg-base) 85%, transparent)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-btn)', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Share2Icon size={16} color="#fff" />
          </div>
          <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>CloudShare</span>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button onClick={() => openSignIn()} style={{ padding: '9px 20px', background: 'transparent', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-btn)', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500, cursor: 'pointer', transition: `all var(--duration) var(--ease)` }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
            Sign In
          </button>
          <button onClick={() => openSignUp()} style={{ padding: '9px 20px', background: 'var(--accent)', border: 'none', borderRadius: 'var(--radius-btn)', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: `background var(--duration) var(--ease)` }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-bright)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}>
            Get Started
          </button>
        </div>
      </nav>
      <HeroSection openSignIn={openSignIn} openSignUp={openSignUp} />
      <FeatureSection features={features} />
      <PricingSection pricingPlans={pricingPlans} openSignUp={openSignUp} />
      <TestimonialSection testimonials={testimonials} openSignUp={openSignUp} />
      <CTASection openSignUp={openSignUp} />
      <Footer />
    </div>
  )
}
export default Landing;
