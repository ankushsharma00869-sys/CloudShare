import React from 'react';
import Modal from './Modal';
const ConfirmationDialog = ({ isOpen, onClose, title = "Confirm Action", message = "Are you sure you want to proceed?", confirmText = "Confirm", cancelText = "Cancel", onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} confirmText={confirmText} cancelText={cancelText} onConfirm={onConfirm}>
      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{message}</p>
    </Modal>
  );
};
export default ConfirmationDialog;
