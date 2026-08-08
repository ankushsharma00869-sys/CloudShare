import React, { useEffect, useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';

import axiosInstance from '../Util/axiosInstance';
import apiEndPoints from '../Util/apiEndpoints';
import { AlertCircle, Loader2, ReceiptIcon, Zap } from 'lucide-react';

const Transation = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
                const response = await axiosInstance.get(apiEndPoints.TRANSACTIONS);
        setTransactions(response.data); setError(null);
      } catch { setError("Failed to load your transaction history."); }
      finally { setLoading(false); }
    };
    fetchTransactions();
  }, []);

  const formatDate = (dateString) => new Date(dateString).toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  const formatAmount = (amountInPaise) => `₹${(amountInPaise / 100).toFixed(2)}`;

  return (
    <DashboardLayout activeMenu="Transactions">
      <div style={{ padding: '32px 24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>Transaction History</h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>All your credit purchases in one place</p>
        </div>

        {error && (
          <div style={{ marginBottom: '24px', padding: '14px 18px', borderRadius: '12px', background: 'var(--red-dim)', color: 'var(--red)', border: '1px solid var(--red)30', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={16} />{error}
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', gap: '12px', color: 'var(--text-muted)' }}>
            <Loader2 size={22} style={{ animation: 'spin 1s linear infinite' }} />
            <span>Loading transactions...</span>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : transactions.length === 0 ? (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '80px 40px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <ReceiptIcon size={28} color='var(--accent-bright)' />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>No transactions yet</h3>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>Your credit purchase history will appear here.</p>
          </div>
        ) : (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-elevated)' }}>
                  {['Date', 'Plan', 'Amount', 'Credits', 'Status', 'Payment ID'].map(h => (
                    <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn.id} style={{ borderTop: '1px solid var(--border-subtle)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '16px 20px', fontSize: '13px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{formatDate(txn.transactionDate)}</td>
                    <td style={{ padding: '16px 20px', fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>
                      {txn.planId === "premium" ? "Premium Plan" : txn.planId === "ultimate" ? "Ultimate Plan" : "Basic Plan"}
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}>{formatAmount(txn.amount)}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'var(--accent-dim)', border: '1px solid var(--accent)', borderRadius: '8px', padding: '4px 10px', fontSize: '13px', fontWeight: 600, color: 'var(--accent-bright)' }}>
                        <Zap size={12} fill='var(--accent-bright)' />+{txn.creditsAdded}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ display: 'inline-flex', padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 600, background: txn.status === "SUCCESS" ? 'var(--green-dim)' : 'var(--red-dim)', color: txn.status === "SUCCESS" ? 'var(--green)' : 'var(--red)' }}>
                        {txn.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                      {txn.paymentId ? txn.paymentId.substring(0, 12) + "..." : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Transation;
