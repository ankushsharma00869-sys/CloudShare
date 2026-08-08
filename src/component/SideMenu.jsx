import { useAuth } from '../context/AuthContext';
import { User } from 'lucide-react';
import React from 'react'
import { SIDE_MENU_DATA } from '../assets/data';
import { useNavigate } from 'react-router-dom';

const SideMenu = ({ activeMenu }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ');
  return (
    <div style={{ width: '240px', height: 'calc(100vh - 61px)', background: 'var(--bg-surface)', borderRight: '1px solid var(--border)', padding: '20px 12px', position: 'sticky', top: '61px', zIndex: 20, overflowY: 'auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '16px 0 24px', borderBottom: '1px solid var(--border)', marginBottom: '16px' }}>
        {user?.photoUrl ? (
          <img src={user.photoUrl} alt="Profile" style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid var(--accent)', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--accent-dim)', border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={24} color='var(--accent-bright)' />
          </div>
        )}
        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center' }}>{fullName}</span>
      </div>

      {SIDE_MENU_DATA.map((item, index) => {
        const isActive = activeMenu === item.label;
        return (
          <button key={index}
            onClick={() => navigate(item.path)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontWeight: isActive ? 600 : 400, padding: '10px 14px', borderRadius: '10px', marginBottom: '4px', cursor: 'pointer', border: 'none', transition: 'all 0.2s',
              background: isActive ? 'var(--accent)' : 'transparent',
              color: isActive ? '#fff' : 'var(--text-secondary)',
              boxShadow: isActive ? '0 4px 20px var(--accent-glow)' : 'none',
            }}
            onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
            onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}>
            <item.icon size={18} />
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

export default SideMenu;
