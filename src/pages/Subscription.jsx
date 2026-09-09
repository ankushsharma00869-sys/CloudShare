import React, { useContext, useState, useEffect } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { UserCreditsContext } from "../context/UserCreditsContext";
import axiosInstance from "../Util/axiosInstance";
import apiEndpoints from "../Util/apiEndpoints";
import {
  AlertCircle,
  CreditCard,
  Check,
  Zap,
  Crown,
} from "lucide-react";

const Subscription = () => {
  const [processingPayment, setProcessingPayment] = useState(false);
  const [activePlan, setActivePlan] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const { user } = useAuth();
  const {
    credits,
    fetchUserCredits,
    plan: currentPlan,
  } = useContext(UserCreditsContext);

  const plans = [
    {
      id: "premium",
      name: "Premium",
      credits: 500,
      price: 500,
      recommended: false,
      icon: Zap,
      color: "#60a5fa",
      features: [
        "Upload up to 500 files",
        "Access to all basic features",
        "25MB max file size",
        "Priority support",
      ],
    },
    {
      id: "ultimate",
      name: "Ultimate",
      credits: 5000,
      price: 2500,
      recommended: true,
      icon: Crown,
      color: "#9d7fff",
      features: [
        "Upload up to 5000 files",
        "Access to all premium features",
        "200MB max file size 🔓",
        "Priority support",
        "Advanced analytics",
      ],
    },
  ];

  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");

      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = () => {
        setRazorpayLoaded(true);
      };

      script.onerror = () => {
        setMessage("Payment gateway failed to load.");
        setMessageType("error");
      };

      document.body.appendChild(script);
    } else {
      setRazorpayLoaded(true);
    }

    fetchUserCredits();
  }, []);

  const handlePurchase = async (selectedPlan) => {
    if (!razorpayLoaded) {
      setMessage("Payment gateway is still loading. Please try again.");
      setMessageType("error");
      return;
    }

    setProcessingPayment(true);
    setActivePlan(selectedPlan.id);
    setMessage("");

    try {
      const response = await axiosInstance.post(
        apiEndpoints.CREATE_ORDER,
        {
          planId: selectedPlan.id,
        }
      );

      if (
        !response.data.success ||
        !response.data.orderId
      ) {
        setMessage("Order creation failed");
        setMessageType("error");
        return;
      }

      const options = {
        key: response.data.razorpayKeyId,
        amount: response.data.amount,
        currency: "INR",
        name: "CloudShare",
        description: `Purchase ${selectedPlan.credits} credits`,
        order_id: response.data.orderId,

        handler: async function (paymentResponse) {
          try {
            const verifyResponse = await axiosInstance.post(
              apiEndpoints.VERIFY_PAYMENT,
              {
                razorpay_order_id:
                  paymentResponse.razorpay_order_id,

                razorpay_payment_id:
                  paymentResponse.razorpay_payment_id,

                razorpay_signature:
                  paymentResponse.razorpay_signature,

                planId: selectedPlan.id,
              }
            );

            if (verifyResponse.data.success) {
              await fetchUserCredits();

              setMessage(
                "Payment successful! Plan activated."
              );
              setMessageType("success");
            } else {
              setMessage("Verification failed");
              setMessageType("error");
            }
          } catch (error) {
            setMessage("Verification error");
            setMessageType("error");
          }
        },

        modal: {
          ondismiss: function () {
            setMessage("Payment cancelled");
            setMessageType("error");
          },
        },

        prefill: {
          name: [user?.firstName, user?.lastName]
            .filter(Boolean)
            .join(" "),
          email: user?.email || "",
        },

        theme: {
          color: "#7c5cfc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Payment failed"
      );
      setMessageType("error");
    } finally {
      setProcessingPayment(false);
      setActivePlan(null);
    }
  };

  return (
    <DashboardLayout activeMenu="Subscription">
      <div style={{ padding: "32px 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: "28px",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "6px",
            }}
          >
            Subscription Plans
          </h1>

          <p
            style={{
              fontSize: "15px",
              color: "var(--text-secondary)",
            }}
          >
            Choose the plan that fits your workflow
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            style={{
              marginBottom: "24px",
              padding: "14px 18px",
              borderRadius: "12px",
              background:
                messageType === "error"
                  ? "var(--red-dim)"
                  : "var(--green-dim)",
              color:
                messageType === "error"
                  ? "var(--red)"
                  : "var(--green)",
              border:
                messageType === "error"
                  ? "1px solid var(--red)"
                  : "1px solid var(--green)",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <AlertCircle size={16} />
            {message}
          </div>
        )}

        {/* Credits Balance */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "var(--accent-dim)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CreditCard
                size={22}
                color="var(--accent-bright)"
              />
            </div>

            <div>
              <div
                style={{
                  fontSize: "13px",
                  color: "var(--text-muted)",
                  marginBottom: "4px",
                }}
              >
                Current Balance
              </div>

              <div
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: "32px",
                  fontWeight: 700,
                  color: "var(--accent-bright)",
                }}
              >
                {credits}

                <span
                  style={{
                    fontSize: "16px",
                    color: "var(--text-secondary)",
                    fontWeight: 400,
                  }}
                >
                  {" "}
                  credits
                </span>
              </div>
            </div>
          </div>

          {/* Current plan */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "100px",
              background:
                currentPlan === "ULTIMATE"
                  ? "var(--accent-dim)"
                  : "var(--bg-elevated)",
              border: "1px solid var(--border)",
              fontSize: "13px",
              fontWeight: 600,
              color:
                currentPlan === "ULTIMATE"
                  ? "var(--accent-bright)"
                  : "var(--text-secondary)",
            }}
          >
            {currentPlan === "ULTIMATE" && (
              <Crown size={13} />
            )}

            {currentPlan || "BASIC"} plan
          </div>
        </div>

        {/* Plans */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {plans.map((selectedPlan) => {
            const PlanIcon = selectedPlan.icon;

            const isProcessing =
              processingPayment &&
              activePlan === selectedPlan.id;

            return (
              <div
                key={selectedPlan.id}
                style={{
                  background: selectedPlan.recommended
                    ? "var(--bg-elevated)"
                    : "var(--bg-card)",

                  border: selectedPlan.recommended
                    ? "1px solid var(--accent)"
                    : "1px solid var(--border)",

                  borderRadius: "20px",
                  padding: "32px",
                  position: "relative",

                  boxShadow: selectedPlan.recommended
                    ? "0 20px 60px var(--accent-glow)"
                    : "none",
                }}
              >
                {/* Recommended Badge */}
                {selectedPlan.recommended && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-14px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "var(--accent)",
                      color: "#fff",
                      fontSize: "12px",
                      fontWeight: 700,
                      padding: "4px 16px",
                      borderRadius: "100px",
                      letterSpacing: "0.5px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Zap size={12} />
                    BEST VALUE
                  </div>
                )}

                {/* Plan Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background:
                        selectedPlan.color + "18",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <PlanIcon
                      size={22}
                      color={selectedPlan.color}
                    />
                  </div>

                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                    }}
                  >
                    {selectedPlan.name}
                  </h3>
                </div>

                {/* Price */}
                <div style={{ marginBottom: "8px" }}>
                  <span
                    style={{
                      fontFamily:
                        "'Manrope', sans-serif",
                      fontSize: "44px",
                      fontWeight: 700,
                      color: selectedPlan.recommended
                        ? "var(--accent-bright)"
                        : "var(--text-primary)",
                    }}
                  >
                    ₹{selectedPlan.price}
                  </span>
                </div>

                {/* Credits */}
                <div
                  style={{
                    fontSize: "14px",
                    color: "var(--text-muted)",
                    marginBottom: "24px",
                  }}
                >
                  {selectedPlan.credits.toLocaleString()}{" "}
                  credits included
                </div>

                {/* Features */}
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    marginBottom: "28px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {selectedPlan.features.map(
                    (feature, index) => (
                      <li
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          fontSize: "14px",
                          color: "var(--text-secondary)",
                        }}
                      >
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            background:
                              "var(--green-dim)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Check
                            size={12}
                            color="var(--green)"
                          />
                        </div>

                        {feature}
                      </li>
                    )
                  )}
                </ul>

                {/* Purchase Button */}
                <button
                  onClick={() =>
                    handlePurchase(selectedPlan)
                  }
                  disabled={isProcessing}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "12px",
                    fontSize: "15px",
                    fontWeight: 600,
                    cursor: isProcessing
                      ? "not-allowed"
                      : "pointer",

                    /* FIXED: only one border property */
                    border: selectedPlan.recommended
                      ? "none"
                      : "1px solid var(--border-strong)",

                    transition: "all 0.2s",

                    background:
                      selectedPlan.recommended
                        ? "var(--accent)"
                        : "var(--bg-elevated)",

                    color: selectedPlan.recommended
                      ? "#fff"
                      : "var(--text-primary)",

                    opacity: isProcessing ? 0.6 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!isProcessing) {
                      e.currentTarget.style.opacity =
                        "0.85";
                      e.currentTarget.style.transform =
                        "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity =
                      isProcessing ? "0.6" : "1";
                    e.currentTarget.style.transform =
                      "translateY(0)";
                  }}
                >
                  {isProcessing
                    ? "Processing..."
                    : `Buy ${selectedPlan.name}`}
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

