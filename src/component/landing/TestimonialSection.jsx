import React from 'react'
import { Star } from "lucide-react";

const TestimonialSection = ({ testimonials }) => {
  return (
    <div style={{ background: 'var(--bg-surface)', padding: '100px 0', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-bright)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>Testimonials</p>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-1px' }}>
            Trusted by professionals
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {testimonials.map((testimonial, index) => (
            <div key={index}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px', transition: 'all 0.25s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < testimonial.rating ? 'var(--yellow)' : 'transparent'} color={i < testimonial.rating ? 'var(--yellow)' : 'var(--text-muted)'} />
                ))}
              </div>
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px', fontStyle: 'italic' }}>
                "{testimonial.quote}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src={testimonial.image} alt={testimonial.name} style={{ width: '44px', height: '44px', borderRadius: '50%', border: '2px solid var(--border-strong)' }} />
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{testimonial.name}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{testimonial.role}, {testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TestimonialSection;
