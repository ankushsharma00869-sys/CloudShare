import React from 'react'
import { Share2Icon } from 'lucide-react';
import { Link } from 'react-router-dom';

const FooterSection = () => {
  return (
    <footer style={{ background: 'var(--bg-base)', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: 'var(--space-10) 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <div style={{ width: '26px', height: '26px', borderRadius: 'var(--radius-sm)', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Share2Icon size={13} color="#fff" />
          </div>
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>CloudShare</span>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
          <Link to="/login" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}>Sign in</Link>
          <Link to="/register" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}>Get started</Link>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>&copy; 2026 CloudShare. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default FooterSection;
