import { LogOut, MenuIcon, Settings, Share2Icon, User, XIcon } from 'lucide-react';
import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import SideMenu from './SideMenu';
import CreditsDisplay from './CreditsDisplay';
import { useEffect } from 'react';
import { UserCreditsContext } from '../context/UserCreditsContext';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSidemenu] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const { credits, fetchUserCredits } = useContext(UserCreditsContext);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { fetchUserCredits(); }, [fetchUserCredits]);

  const handleLogout = () => {
    logout();
    setOpenUserMenu(false);
    // Redirect after logout
    navigate('/login', { replace: true });
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', backdropFilter: 'blur(20px)', padding: '14px 24px', position: 'sticky', top: 0, zIndex: 30 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={() => setOpenSidemenu(!openSideMenu)}
          style={{ display: 'none', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px', color: 'var(--text-primary)', cursor: 'pointer' }}
          className="mobile-menu-btn">
          {openSideMenu ? <XIcon size={20} /> : <MenuIcon size={20} />}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Share2Icon size={16} color='#fff' />
          </div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>CloudShare</span>
        </div>
      </div>

      {isAuthenticated && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/subscription" style={{ textDecoration: 'none' }}>
            <CreditsDisplay credits={credits} />
          </Link>

          {/* Replaces Clerk's <UserButton /> */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setOpenUserMenu((v) => !v)}
              style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-dim)', border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              title={user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.email}
            >
              {user?.photoUrl ? (
                <img src={user.photoUrl} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <User size={16} color='var(--accent-bright)' />
              )}
            </button>

            {openUserMenu && (
              <div style={{ position: 'absolute', right: 0, top: '46px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', minWidth: '180px', boxShadow: '0 12px 40px rgba(0,0,0,0.4)', overflow: 'hidden', zIndex: 40 }}>
                <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{user?.firstName} {user?.lastName}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
                </div>
                <button onClick={() => { setOpenUserMenu(false); navigate('/profile'); }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                  <Settings size={14} /> Profile Settings
                </button>
                <button onClick={handleLogout}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'none', border: 'none', color: 'var(--red)', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                  <LogOut size={14} /> Log out
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {openSideMenu && (
        <div style={{ position: 'fixed', top: '61px', left: 0, right: 0, background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', zIndex: 20 }}>
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}

      <style>{`@media (max-width: 1080px) { .mobile-menu-btn { display: flex !important; } }`}</style>
    </div>
  )
}

export default Navbar;
