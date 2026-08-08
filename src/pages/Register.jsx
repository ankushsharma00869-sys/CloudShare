import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Share2Icon, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);
    const result = await register({ firstName, lastName, email, password });
    setSubmitting(false);

    if (result.success) {
      // Redirect after registration straight into the app.
      navigate('/dashboard', { replace: true });
    } else {
      setError(result.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '28px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Share2Icon size={18} color="#fff" />
          </div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>CloudShare</span>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '32px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px', fontFamily: "'Space Grotesk', sans-serif" }}>Create your account</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>Start sharing files securely in seconds</p>

          {error && (
            <div style={{ marginBottom: '18px', padding: '10px 14px', borderRadius: '10px', background: 'var(--red-dim)', color: 'var(--red)', border: '1px solid var(--red)30', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', flex: 1 }}>
                First name
                <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} style={inputStyle} placeholder="Ada" />
              </label>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', flex: 1 }}>
                Last name
                <input value={lastName} onChange={(e) => setLastName(e.target.value)} style={inputStyle} placeholder="Lovelace" />
              </label>
            </div>

            <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginTop: '16px' }}>
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                placeholder="you@example.com"
              />
            </label>

            <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginTop: '16px' }}>
              Password
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                placeholder="At least 6 characters"
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              style={{ width: '100%', marginTop: '22px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '12px', padding: '13px', fontSize: '15px', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: submitting ? 0.7 : 1 }}
            >
              {submitting ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Creating account...</> : 'Create Account'}
            </button>
          </form>

          <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent-bright)', fontWeight: 600, textDecoration: 'none' }}>Log in</Link>
          </p>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Register;
