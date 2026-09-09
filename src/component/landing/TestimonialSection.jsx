import React from 'react'
import { Star } from "lucide-react";

const TestimonialSection = ({ testimonials }) => {
  return (
    <div style={{ background: 'var(--bg-surface)', padding: 'var(--space-24) 0', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ marginBottom: 'var(--space-12)', maxWidth: '520px' }}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-bright)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 'var(--space-3)' }}>Testimonials</p>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 38px)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            What people use it for
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-5)' }}>
          {testimonials.map((testimonial, index) => (
            <div key={index}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-8)' }}>
              <div style={{ display: 'flex', gap: '3px', marginBottom: 'var(--space-4)' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < testimonial.rating ? 'var(--yellow)' : 'transparent'} color={i < testimonial.rating ? 'var(--yellow)' : 'var(--text-muted)'} />
                ))}
              </div>
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 'var(--space-6)' }}>
                {testimonial.quote}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <img src={testimonial.image} alt={testimonial.name} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--border-strong)' }} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{testimonial.name}</div>
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
