import React from 'react'
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
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 32px', position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          </div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>CloudShare</span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => openSignIn()} style={{ padding: '9px 20px', background: 'transparent', border: '1px solid var(--border-strong)', borderRadius: '10px', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
            Sign In
          </button>
          <button onClick={() => openSignUp()} style={{ padding: '9px 20px', background: 'var(--accent)', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
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
      <CTASection />
      <Footer />
    </div>
  )
}
export default Landing;
