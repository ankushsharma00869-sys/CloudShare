import React from "react";
import { Copy, X, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

const LinkShareModal = ({ isOpen, onClose, link }) => {
  if (!isOpen) return null;
  const handleCopy = () => { navigator.clipboard.writeText(link); toast.success("Link copied!"); };
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div style={{ width: '100%', maxWidth: '460px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '20px', boxShadow: '0 40px 80px rgba(0,0,0,0.5)', margin: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)' }}>Share File</h2>
          <button onClick={onClose} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}><X size={16} /></button>
        </div>
        <div style={{ padding: '24px' }}>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>Share this link with anyone:</p>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--accent)', borderRadius: '12px', overflow: 'hidden', background: 'var(--bg-card)' }}>
            <input type="text" value={link} readOnly style={{ flex: 1, padding: '12px 16px', background: 'transparent', border: 'none', outline: 'none', fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'monospace' }} />
            <button onClick={handleCopy} style={{ padding: '12px 16px', background: 'var(--bg-elevated)', border: 'none', cursor: 'pointer', color: 'var(--accent-bright)', borderLeft: '1px solid var(--border)', display: 'flex', alignItems: 'center', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-dim)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-elevated)'}>
              <Copy size={16} />
            </button>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>Anyone with this link can access this file.</p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button onClick={() => window.open(link, "_blank")} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '11px', border: '1px solid var(--border)', borderRadius: '12px', background: 'transparent', color: 'var(--text-secondary)', fontSize: '14px', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <ExternalLink size={15} /> Open Link
            </button>
            <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Check this file: ${link}`)}`, "_blank")} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '11px', border: 'none', borderRadius: '12px', background: '#22c55e20', color: 'var(--green)', fontSize: '14px', cursor: 'pointer', fontWeight: 500 }}>
              📱 WhatsApp
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '16px 24px', borderTop: '1px solid var(--border)' }}>
          <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: '14px', cursor: 'pointer' }}>Close</button>
          <button onClick={handleCopy} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: 'var(--accent)', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Copy Link</button>
        </div>
      </div>
    </div>
  );
};
export default LinkShareModal;
