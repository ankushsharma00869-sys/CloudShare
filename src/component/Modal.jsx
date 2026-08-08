import React from "react";
import { X } from "lucide-react";

const DeleteModal = ({ isOpen, onClose, onConfirm, title = "Confirm Action", confirmText = "Confirm", cancelText = "Cancel", children }) => {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div style={{ width: '100%', maxWidth: '440px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '20px', boxShadow: '0 40px 80px rgba(0,0,0,0.5)', margin: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} />
          </button>
        </div>
        <div style={{ padding: '20px 24px' }}>{children}</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '16px 24px', borderTop: '1px solid var(--border)' }}>
          <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>{cancelText}</button>
          <button onClick={onConfirm} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: 'var(--red)', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
};
export default DeleteModal;
