import { Card } from "../../components/ui/Card";
import { CreditCard, Download, Calendar, Check, X, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";

const initialInvoices = [
  { id: "INV-2026-05", date: "May 1, 2026", amount: "$2,499", status: "Paid" },
  { id: "INV-2026-04", date: "Apr 1, 2026", amount: "$2,499", status: "Paid" },
  { id: "INV-2026-03", date: "Mar 1, 2026", amount: "$2,499", status: "Paid" },
  { id: "INV-2026-02", date: "Feb 1, 2026", amount: "$2,499", status: "Paid" },
  { id: "INV-2026-01", date: "Jan 1, 2026", amount: "$2,499", status: "Paid" },
];

const PLANS = [
  { name: "Starter", price: "$49", period: "/month", users: "Up to 5 users", projects: "10 projects", storage: "10 GB storage", support: "Email support", highlight: false },
  { name: "Pro", price: "$299", period: "/month", users: "Up to 50 users", projects: "Unlimited projects", storage: "100 GB storage", support: "Priority support", highlight: true },
  { name: "Enterprise", price: "$2,499", period: "/month", users: "Unlimited users", projects: "Unlimited projects", storage: "1 TB storage", support: "24/7 dedicated support", highlight: false },
];

const statusStyles = {
  Paid: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Failed: "bg-red-100 text-red-700",
};

const Billing = () => {
  const [currentPlan, setCurrentPlan] = useState("Enterprise");
  const [showChangePlan, setShowChangePlan] = useState(false);
  const [showUpdatePayment, setShowUpdatePayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("Enterprise");
  const [cardForm, setCardForm] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [cardError, setCardError] = useState("");
  const [toast, setToast] = useState(null);
  const [toastType, setToastType] = useState("success");

  const showToast = (msg, type) => {
    setToast(msg); setToastType(type); setTimeout(() => setToast(null), 3000);
  };

  const confirmPlanChange = () => {
    setCurrentPlan(selectedPlan);
    setShowChangePlan(false);
    showToast(`Plan changed to ${selectedPlan}`);
  };

  const savePaymentMethod = () => {
    if (cardForm.number.replace(/\s/g, "").length < 16) { setCardError("Enter a valid 16-digit card number"); return; }
    if (!cardForm.name.trim()) { setCardError("Enter cardholder name"); return; }
    if (cardForm.expiry.length < 5) { setCardError("Enter valid expiry (MM/YY)"); return; }
    if (cardForm.cvv.length < 3) { setCardError("Enter valid CVV"); return; }
    setCardError(""); setShowUpdatePayment(false);
    showToast("Payment method updated successfully");
  };

  const formatCardNumber = (v) => {
    const digits = v.replace(/\D/g, "").substring(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (v) => {
    const digits = v.replace(/\D/g, "").substring(0, 4);
    return digits.length > 2 ? `${digits.substring(0, 2)}/${digits.substring(2)}` : digits;
  };

  const maskedCard = cardForm.number ? `•••• •••• •••• ${cardForm.number.replace(/\s/g, "").slice(-4)}` : "•••• •••• •••• 4242";
  const cardHolder = cardForm.name || "JOHN DOE";

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl ${toastType === "success" ? "bg-gray-900 text-white" : "bg-red-600 text-white"}`}>
          {toastType === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-white" />}
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}

      <div><h1 className="text-2xl font-bold text-gray-900 mb-2">Billing & Subscription</h1><p className="text-gray-600">Manage your subscription and payment information</p></div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Current Plan */}
          <Card title="Current Plan">
            <div className="p-6 bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-2xl font-bold text-gray-900">{currentPlan} Plan</h3>
                    <span className="px-2.5 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-lg">Active</span>
                  </div>
                  <p className="text-gray-600 mb-3">Unlimited users and projects with priority support</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-gray-900">{PLANS.find(p => p.name === currentPlan)?.price}</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                </div>
                <button onClick={() => { setSelectedPlan(currentPlan); setShowChangePlan(true); }} className="px-4 py-2 bg-white border border-blue-200 rounded-xl hover:bg-blue-50 text-sm font-medium text-blue-700 shadow-sm">
                  Change Plan
                </button>
              </div>
              <div className="pt-4 border-t border-blue-200 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-700"><Calendar className="w-4 h-4 text-blue-500" />Next billing: <span className="font-medium">Jun 1, 2026</span></div>
                <div className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle2 className="w-4 h-4 text-emerald-500" /><span className="font-medium">Auto-renewal on</span></div>
              </div>
            </div>
          </Card>

          {/* Billing History */}
          <Card title="Billing History">
            <div className="divide-y divide-gray-100">
              {initialInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between py-4 px-6 hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{invoice.id}</p>
                      <p className="text-xs text-gray-500">{invoice.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{invoice.amount}</p>
                      <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${statusStyles[invoice.status]}`}>{invoice.status}</span>
                    </div>
                    <button onClick={() => showToast(`Downloaded ${invoice.id}`)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100" title="Download">
                      <Download className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Payment Method */}
          <Card title="Payment Method">
            <div className="p-6">
              <div className="bg-linear-to-br from-gray-900 to-gray-700 rounded-xl p-5 text-white mb-4 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 right-4 w-32 h-32 bg-white rounded-full" />
                  <div className="absolute top-8 right-12 w-24 h-24 bg-white rounded-full" />
                </div>
                <div className="flex justify-between items-start mb-6">
                  <CreditCard className="w-7 h-7 opacity-80" />
                  <span className="text-sm font-semibold tracking-widest opacity-80">VISA</span>
                </div>
                <p className="text-lg tracking-[0.2em] mb-5 font-mono">{maskedCard}</p>
                <div className="flex justify-between text-xs opacity-80 uppercase tracking-wider">
                  <span>{cardHolder}</span>
                  <span>{cardForm.expiry || "12/28"}</span>
                </div>
              </div>
              <button onClick={() => { setCardForm({ number: "", name: "", expiry: "", cvv: "" }); setCardError(""); setShowUpdatePayment(true); }} className="w-full py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700">
                Update Payment Method
              </button>
            </div>
          </Card>

          {/* Usage */}
          <Card title="Usage This Month">
            <div className="p-6 space-y-4">
              {[
                { label: "Active Users", used: 2543, total: "Unlimited" },
                { label: "Projects", used: 48, total: "Unlimited" },
                { label: "Storage", used: 45, total: "1 TB", percent: 4.5 },
                { label: "API Calls", used: 124800, total: "500,000", percent: 25 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-600 font-medium">{item.label}</span>
                    <span className="text-gray-900 font-semibold">{typeof item.used === "number" && item.used > 999 ? item.used.toLocaleString() : item.used} / {item.total}</span>
                  </div>
                  {item.percent !== undefined && (
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${item.percent}%` }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Change Plan Modal */}
      {showChangePlan && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Change Plan</h3>
              <button onClick={() => setShowChangePlan(false)} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-3 gap-4">
              {PLANS.map((plan) => (
                <button
                  key={plan.name}
                  onClick={() => setSelectedPlan(plan.name)}
                  className={`p-5 rounded-xl border-2 text-left transition-all ${selectedPlan === plan.name ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"} ${plan.highlight ? "ring-1 ring-blue-200" : ""}`}
                >
                  {plan.highlight && <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2 block">Most Popular</span>}
                  <p className="font-bold text-gray-900 text-lg mb-0.5">{plan.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-3">{plan.price}<span className="text-sm font-normal text-gray-500">{plan.period}</span></p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {[plan.users, plan.projects, plan.storage, plan.support].map((f) => (
                      <li key={f} className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" />{f}</li>
                    ))}
                  </ul>
                  {currentPlan === plan.name && <p className="text-xs text-blue-600 font-semibold mt-3">Current plan</p>}
                </button>
              ))}
            </div>
            <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-100 flex gap-3">
              <button onClick={() => setShowChangePlan(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={confirmPlanChange} disabled={selectedPlan === currentPlan} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-40">
                {selectedPlan === currentPlan ? "Already on this plan" : `Switch to ${selectedPlan}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Payment Modal */}
      {showUpdatePayment && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5"><h3 className="text-lg font-semibold text-gray-900">Update Payment Method</h3><button onClick={() => setShowUpdatePayment(false)} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button></div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Card Number</label>
                <input value={cardForm.number} onChange={(e) => setCardForm({ ...cardForm, number: formatCardNumber(e.target.value) })} placeholder="1234 5678 9012 3456" maxLength={19} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Cardholder Name</label>
                <input value={cardForm.name} onChange={(e) => setCardForm({ ...cardForm, name: e.target.value.toUpperCase() })} placeholder="JOHN DOE" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm uppercase" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Expiry Date</label>
                  <input value={cardForm.expiry} onChange={(e) => setCardForm({ ...cardForm, expiry: formatExpiry(e.target.value) })} placeholder="MM/YY" maxLength={5} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">CVV</label>
                  <input value={cardForm.cvv} onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value.replace(/\D/g, "").substring(0, 4) })} placeholder="123" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
              </div>
              {cardError && <p className="text-xs text-red-500 font-medium">{cardError}</p>}
              <p className="text-xs text-gray-400 flex items-center gap-1">🔒 Your payment info is encrypted and secure</p>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowUpdatePayment(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={savePaymentMethod} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">Save Card</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Billing;