import React, { useContext, useRef, useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { User, Camera, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '10px',
  border: '1px solid var(--border)',
  background: 'var(--bg-elevated)',
  color: 'var(--text-primary)',
  fontSize: '14px',
  outline: 'none',
  marginTop: '6px',
};

const Profile = () => {
  const { user, updateProfile, updatePhoto } = useAuth();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const fileInputRef = useRef(null);

  const msgColors = {
    error: ['var(--red-dim)', 'var(--red)'],
    success: ['var(--green-dim)', 'var(--green)'],
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setMessage('');
    const result = await updateProfile({ firstName, lastName, email });
    setSavingProfile(false);
    if (result.success) {
      setMessage('Profile updated successfully.');
      setMessageType('success');
    } else {
      setMessage(result.message);
      setMessageType('error');
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage('Please select an image file.');
      setMessageType('error');
      return;
    }

    setUploadingPhoto(true);
    setMessage('');
    const result = await updatePhoto(file);
    setUploadingPhoto(false);
    if (result.success) {
      setMessage('Profile photo updated.');
      setMessageType('success');
    } else {
      setMessage(result.message);
      setMessageType('error');
    }
    // allow re-selecting the same file again later
    e.target.value = '';
  };

  return (
    <DashboardLayout activeMenu="Profile">
      <div style={{ padding: '32px 24px', maxWidth: '640px' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>Profile Settings</h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>Update your name, email, and profile photo</p>
        </div>

        {message && (
          <div style={{ marginBottom: '20px', padding: '12px 16px', borderRadius: '10px', background: msgColors[messageType]?.[0], color: msgColors[messageType]?.[1], border: `1px solid ${msgColors[messageType]?.[1]}30`, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {messageType === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />} {message}
          </div>
        )}

        {/* Photo */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            {user?.photoUrl ? (
              <img src={user.photoUrl} alt="Profile" style={{ width: '84px', height: '84px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent)' }} />
            ) : (
              <div style={{ width: '84px', height: '84px', borderRadius: '50%', background: 'var(--accent-dim)', border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={34} color="var(--accent-bright)" />
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingPhoto}
              title="Change photo"
              style={{ position: 'absolute', bottom: 0, right: 0, width: '30px', height: '30px', borderRadius: '50%', background: 'var(--accent)', border: '2px solid var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: uploadingPhoto ? 'not-allowed' : 'pointer' }}
            >
              {uploadingPhoto ? <Loader2 size={14} color="#fff" style={{ animation: 'spin 1s linear infinite' }} /> : <Camera size={14} color="#fff" />}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>{user?.firstName} {user?.lastName}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>{user?.email}</div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingPhoto}
              style={{ marginTop: '10px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px 14px', fontSize: '13px', color: 'var(--text-secondary)', cursor: uploadingPhoto ? 'not-allowed' : 'pointer' }}
            >
              {uploadingPhoto ? 'Uploading...' : 'Change photo'}
            </button>
          </div>
        </div>

        {/* Name / email form */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px' }}>
          <form onSubmit={handleSaveProfile}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', flex: 1 }}>
                First name
                <input value={firstName} onChange={(e) => setFirstName(e.target.value)} style={inputStyle} placeholder="First name" />
              </label>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', flex: 1 }}>
                Last name
                <input value={lastName} onChange={(e) => setLastName(e.target.value)} style={inputStyle} placeholder="Last name" />
              </label>
            </div>

            <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginTop: '16px' }}>
              Email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} placeholder="you@example.com" />
            </label>

            <button
              type="submit"
              disabled={savingProfile}
              style={{ marginTop: '22px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 28px', fontSize: '15px', fontWeight: 600, cursor: savingProfile ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', opacity: savingProfile ? 0.7 : 1 }}
            >
              {savingProfile ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</> : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </DashboardLayout>
  );
};

export default Profile;
