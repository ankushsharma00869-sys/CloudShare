import React, { useContext, useState, useEffect } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { UserCreditsContext } from "../context/UserCreditsContext";
import axiosInstance from "../Util/axiosInstance";
import apiEndpoints from "../Util/apiEndpoints";
import { AlertCircle, CreditCard, Check, Zap, Crown } from "lucide-react";

const Subscription = () => {
  const [processingPayment, setProcessingPayment] = useState(false);
  const [activePlan, setActivePlan] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const { user } = useAuth();
  const { credits, setCredits, fetchUserCredits } = useContext(UserCreditsContext);

  const plans = [
    { id: "premium", name: "Premium", credits: 500, price: 500, recommended: false, icon: Zap, color: '#60a5fa', features: ["Upload up to 500 files", "Access to all basic features", "Priority support"] },
    { id: "ultimate", name: "Ultimate", credits: 5000, price: 2500, recommended: true, icon: Crown, color: '#9d7fff', features: ["Upload up to 5000 files", "Access to all premium features", "Priority support", "Advanced analytics"] },
  ];

  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => setRazorpayLoaded(true);
      script.onerror = () => { setMessage("Payment gateway failed to load."); setMessageType("error"); };
      document.body.appendChild(script);
    } else setRazorpayLoaded(true);
    fetchUserCredits();
  }, []);

  const handlePurchase = async (plan) => {
    if (!razorpayLoaded) return;
    setProcessingPayment(true); setActivePlan(plan.id); setMessage("");
    try {
      const response = await axiosInstance.post(apiEndpoints.CREATE_ORDER, { planId: plan.id });
      if (!response.data.success || !response.data.orderId) { setMessage("Order creation failed"); setMessageType("error"); return; }
      const options = {
        key: response.data.razorpayKeyId, amount: response.data.amount, currency: "INR",
        name: "CloudShare", description: `Purchase ${plan.credits} credits`, order_id: response.data.orderId,
        handler: async function (response) {
          try {
            const verifyResponse = await axiosInstance.post(apiEndpoints.VERIFY_PAYMENT, { razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature, planId: plan.id });
            if (verifyResponse.data.success) { await fetchUserCredits(); setMessage("Payment successful! Plan activated"); setMessageType("success"); }
            else { setMessage("Verification failed"); setMessageType("error"); }
          } catch { setMessage("Verification error"); setMessageType("error"); }
        },
        modal: { ondismiss: function () { setMessage("Payment cancelled"); setMessageType("error"); } },
        prefill: { name: [user?.firstName, user?.lastName].filter(Boolean).join(' '), email: user?.email || "" },
        theme: { color: "#7c5cfc" },
      };
      new window.Razorpay(options).open();
    } catch (error) { setMessage(error.response?.data?.message || "Payment failed"); setMessageType("error"); }
    finally { setProcessingPayment(false); setActivePlan(null); }
  };

  return (
    <DashboardLayout activeMenu="Subscription">
      <div style={{ padding: '32px 24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>Subscription Plans</h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>Choose the plan that fits your workflow</p>
        </div>

        {message && (
          <div style={{ marginBottom: '24px', padding: '14px 18px', borderRadius: '12px', background: messageType === 'error' ? 'var(--red-dim)' : 'var(--green-dim)', color: messageType === 'error' ? 'var(--red)' : 'var(--green)', border: `1px solid ${messageType === 'error' ? 'var(--red)' : 'var(--green)'}30`, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={16} />{message}
          </div>
        )}

        {/* Credits balance */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCard size={22} color='var(--accent-bright)' />
            </div>
            <div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>Current Balance</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '32px', fontWeight: 700, color: 'var(--accent-bright)' }}>{credits} <span style={{ fontSize: '16px', color: 'var(--text-secondary)', fontWeight: 400 }}>credits</span></div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {plans.map((plan) => {
            const PlanIcon = plan.icon;
            return (
              <div key={plan.id} style={{ background: plan.recommended ? 'var(--bg-elevated)' : 'var(--bg-card)', border: `1px solid ${plan.recommended ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '20px', padding: '32px', position: 'relative', boxShadow: plan.recommended ? '0 20px 60px var(--accent-glow)' : 'none' }}>
                {plan.recommended && (
                  <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent)', color: '#fff', fontSize: '12px', fontWeight: 700, padding: '4px 16px', borderRadius: '100px', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Zap size={12} /> BEST VALUE
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: plan.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PlanIcon size={22} color={plan.color} />
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>{plan.name}</h3>
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '44px', fontWeight: 700, color: plan.recommended ? 'var(--accent-bright)' : 'var(--text-primary)' }}>₹{plan.price}</span>
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>{plan.credits.toLocaleString()} credits included</div>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {plan.features.map((f, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--green-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Check size={12} color='var(--green)' />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => handlePurchase(plan)} disabled={processingPayment && activePlan === plan.id}
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', border: 'none', transition: 'all 0.2s', background: plan.recommended ? 'var(--accent)' : 'var(--bg-elevated)', color: plan.recommended ? '#fff' : 'var(--text-primary)', border: plan.recommended ? 'none' : '1px solid var(--border-strong)', opacity: processingPayment && activePlan === plan.id ? 0.6 : 1 }}
                  onMouseEnter={e => { if (!(processingPayment && activePlan === plan.id)) { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  {processingPayment && activePlan === plan.id ? "Processing..." : `Buy ${plan.name}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Subscription;
