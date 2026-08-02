import { Card } from "../../components/ui/Card";
import { Bell, Shield, Globe, Mail, X, Eye, EyeOff, CheckCircle2, Monitor, Smartphone, Save } from "lucide-react";
import { useState } from "react";

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${checked ? "bg-blue-600" : "bg-gray-200"}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

const TIMEZONES = [
  "UTC-8:00 (Pacific)", "UTC-7:00 (Mountain)", "UTC-6:00 (Central)", "UTC-5:00 (Eastern)",
  "UTC+0:00 (London/Dublin)", "UTC+1:00 (Paris/Berlin)", "UTC+2:00 (Cairo)", "UTC+3:00 (Moscow)",
  "UTC+5:30 (Mumbai)", "UTC+8:00 (Beijing/Singapore)", "UTC+9:00 (Tokyo)", "UTC+10:00 (Sydney)",
];
const LANGUAGES = ["English", "Spanish", "French", "German", "Portuguese", "Japanese", "Chinese (Simplified)", "Korean", "Arabic", "Hindi"];

const SESSIONS = [
  { id: 1, device: "Chrome on macOS", location: "San Francisco, CA", lastActive: "Active now", current: true, Icon: Monitor },
  { id: 2, device: "Safari on iPhone", location: "San Francisco, CA", lastActive: "2 hours ago", current: false, Icon: Smartphone },
  { id: 3, device: "Firefox on Windows", location: "New York, NY", lastActive: "3 days ago", current: false, Icon: Monitor },
];

const Settings = ()=> {
  const [toast, setToast] = useState(null);
  const [notifs, setNotifs] = useState({ email: true, push: true, taskReminders: false, mentions: true, projectUpdates: true, deadlineAlerts: true });
  const [emailPrefs, setEmailPrefs] = useState({ weeklyReports: true, productUpdates: false, teamMentions: true, securityAlerts: true, billingNotifs: true });
  const [language, setLanguage] = useState("English");
  const [timezone, setTimezone] = useState("UTC-8:00 (Pacific)");
  const [theme, setTheme] = useState("light");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showTwoFA, setShowTwoFA] = useState(false);
  const [showSessions, setShowSessions] = useState(false);
  const [sessions, setSessions] = useState(SESSIONS);
  const [passwordForm, setPasswordForm] = useState({ current: "", newPass: "", confirm: "" });
  const [showPasswords, setShowPasswords] = useState({ current: false, newPass: false, confirm: false });
  const [passwordError, setPasswordError] = useState("");
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const changePassword = () => {
    if (!passwordForm.current) { setPasswordError("Enter your current password"); return; }
    if (passwordForm.newPass.length < 8) { setPasswordError("New password must be at least 8 characters"); return; }
    if (passwordForm.newPass !== passwordForm.confirm) { setPasswordError("Passwords do not match"); return; }
    setPasswordError(""); setPasswordForm({ current: "", newPass: "", confirm: "" });
    setShowChangePassword(false); showToast("Password changed successfully");
  };

  const getStrength = () => {
    const p = passwordForm.newPass; if (!p) return null;
    let s = 0;
    if (p.length >= 8) s++; if (/[A-Z]/.test(p)) s++; if (/[0-9]/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++;
    const levels = [null, { label: "Weak", color: "bg-red-500", w: "w-1/4" }, { label: "Fair", color: "bg-amber-500", w: "w-2/4" }, { label: "Good", color: "bg-blue-500", w: "w-3/4" }, { label: "Strong", color: "bg-emerald-500", w: "w-full" }];
    return levels[s];
  };
  const strength = getStrength();

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-xl">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-medium">{toast}</span>
          <button onClick={() => setToast(null)} className="ml-1 text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
        </div>
      )}

      <div><h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1><p className="text-gray-600">Manage your account and system preferences</p></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center"><Bell className="w-5 h-5 text-blue-600" /></div>
              <h3 className="font-semibold text-gray-900">Notifications</h3>
            </div>
            <div className="space-y-4">
              {[
                { key: "email", label: "Email notifications", desc: "Receive updates via email" },
                { key: "push", label: "Push notifications", desc: "Browser push alerts" },
                { key: "taskReminders", label: "Task reminders", desc: "Remind before deadlines" },
                { key: "mentions", label: "Mentions", desc: "When someone @mentions you" },
                { key: "projectUpdates", label: "Project updates", desc: "Status changes in projects" },
                { key: "deadlineAlerts", label: "Deadline alerts", desc: "24h before due dates" },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between py-1">
                  <div><p className="text-sm font-medium text-gray-900">{label}</p><p className="text-xs text-gray-400">{desc}</p></div>
                  <Toggle checked={notifs[key]} onChange={(v) => setNotifs({ ...notifs, [key]: v })} />
                </div>
              ))}
            </div>
            <button onClick={() => showToast("Notification preferences saved")} className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-medium">
              <Save className="w-4 h-4" /> Save Notifications
            </button>
          </div>
        </Card>

        {/* Security */}
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center"><Shield className="w-5 h-5 text-purple-600" /></div>
              <h3 className="font-semibold text-gray-900">Security</h3>
            </div>
            <div className="space-y-3">
              <button onClick={() => setShowChangePassword(true)} className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm text-left flex items-center justify-between group">
                <div><p className="font-medium text-gray-900">Change Password</p><p className="text-xs text-gray-400 mt-0.5">Last changed 3 months ago</p></div>
                <span className="text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100">Update →</span>
              </button>
              <button onClick={() => setShowTwoFA(true)} className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm text-left flex items-center justify-between">
                <div><p className="font-medium text-gray-900">Two-Factor Authentication</p><p className="text-xs text-gray-400 mt-0.5">{twoFAEnabled ? "Enabled — Authenticator app" : "Not enabled"}</p></div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${twoFAEnabled ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{twoFAEnabled ? "ON" : "OFF"}</span>
              </button>
              <button onClick={() => setShowSessions(true)} className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm text-left flex items-center justify-between group">
                <div><p className="font-medium text-gray-900">Active Sessions</p><p className="text-xs text-gray-400 mt-0.5">{sessions.length} active session{sessions.length !== 1 ? "s" : ""}</p></div>
                <span className="text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100">View →</span>
              </button>
            </div>
            <div className="mt-5 pt-5 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Danger Zone</p>
              <button onClick={() => showToast("Account deletion request submitted — check your email")} className="w-full py-2.5 px-4 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 text-sm font-medium">Delete Account</button>
            </div>
          </div>
        </Card>

        {/* Preferences */}
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center"><Globe className="w-5 h-5 text-green-600" /></div>
              <h3 className="font-semibold text-gray-900">Preferences</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Language</label>
                <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
                  {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Timezone</label>
                <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
                  {TIMEZONES.map((tz) => <option key={tz}>{tz}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Theme</label>
                <div className="grid grid-cols-3 gap-2">
                  {["light", "dark", "system"].map((t) => (
                    <button key={t} onClick={() => setTheme(t)} className={`py-2 rounded-xl text-sm font-medium capitalize border transition-colors ${theme === t ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{t}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Date Format</label>
                <select value={dateFormat} onChange={(e) => setDateFormat(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
                  {["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"].map((f) => <option key={f}>{f}</option>)}
                </select>
              </div>
            </div>
            <button onClick={() => showToast("Preferences saved")} className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-medium">
              <Save className="w-4 h-4" /> Save Preferences
            </button>
          </div>
        </Card>

        {/* Email Preferences */}
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center"><Mail className="w-5 h-5 text-orange-600" /></div>
              <h3 className="font-semibold text-gray-900">Email Preferences</h3>
            </div>
            <div className="space-y-4">
              {[
                { key: "weeklyReports", label: "Weekly reports", desc: "Summary of team activity" },
                { key: "productUpdates", label: "Product updates", desc: "New features and improvements" },
                { key: "teamMentions", label: "Team mentions", desc: "When you're mentioned in a comment" },
                { key: "securityAlerts", label: "Security alerts", desc: "Login from new devices" },
                { key: "billingNotifs", label: "Billing notifications", desc: "Invoices and payment receipts" },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between py-1">
                  <div><p className="text-sm font-medium text-gray-900">{label}</p><p className="text-xs text-gray-400">{desc}</p></div>
                  <Toggle checked={emailPrefs[key]} onChange={(v) => setEmailPrefs({ ...emailPrefs, [key]: v })} />
                </div>
              ))}
            </div>
            <button onClick={() => showToast("Email preferences saved")} className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-medium">
              <Save className="w-4 h-4" /> Save Email Preferences
            </button>
          </div>
        </Card>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5"><h3 className="text-lg font-semibold text-gray-900">Change Password</h3><button onClick={() => { setShowChangePassword(false); setPasswordError(""); }} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button></div>
            <div className="space-y-4">
              {([["current", "Current Password", "Enter current password"], ["newPass", "New Password", "At least 8 characters"], ["confirm", "Confirm New Password", "Repeat new password"]]).map(([key, label, placeholder]) => (
                <div key={key}>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">{label}</label>
                  <div className="relative">
                    <input type={showPasswords[key] ? "text" : "password"} value={passwordForm[key]} onChange={(e) => setPasswordForm({ ...passwordForm, [key]: e.target.value })} placeholder={placeholder} className="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                    <button type="button" onClick={() => setShowPasswords({ ...showPasswords, [key]: !showPasswords[key] })} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPasswords[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                  </div>
                  {key === "newPass" && strength && (
                    <div className="mt-1.5"><div className="h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${strength.color} ${strength.w}`} /></div><p className="text-xs text-gray-500 mt-0.5">{strength.label}</p></div>
                  )}
                </div>
              ))}
              {passwordError && <p className="text-xs text-red-500 font-medium">{passwordError}</p>}
            </div>
            <div className="flex gap-3 mt-6"><button onClick={() => { setShowChangePassword(false); setPasswordError(""); }} className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button><button onClick={changePassword} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">Update Password</button></div>
          </div>
        </div>
      )}

      {/* 2FA Modal */}
      {showTwoFA && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5"><h3 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3><button onClick={() => setShowTwoFA(false)} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button></div>
            {!twoFAEnabled ? (
              <>
                <p className="text-sm text-gray-600 mb-4">Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)</p>
                <div className="w-40 h-40 bg-gray-50 rounded-xl mx-auto mb-4 flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="grid grid-cols-7 gap-0.5 p-2">
                    {Array.from({ length: 49 }, (_, i) => <div key={i} className={`w-2.5 h-2.5 rounded-sm ${[0,2,4,6,7,13,14,16,18,20,21,27,28,30,32,34,35,41,42,44,46,48].includes(i) ? "bg-gray-800" : "bg-transparent"}`} />)}
                  </div>
                </div>
                <p className="text-xs text-center text-gray-500 mb-4">Manual entry: <span className="font-mono font-semibold text-gray-700">JBSWY3DPEHPK3PXP</span></p>
                <button onClick={() => { setTwoFAEnabled(true); setShowTwoFA(false); showToast("Two-factor authentication enabled"); }} className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">Enable 2FA</button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl mb-4"><CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /><p className="text-sm text-emerald-700 font-medium">2FA is currently enabled on your account</p></div>
                <button onClick={() => { setTwoFAEnabled(false); setShowTwoFA(false); showToast("Two-factor authentication disabled"); }} className="w-full py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700">Disable 2FA</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Sessions Modal */}
      {showSessions && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5"><h3 className="text-lg font-semibold text-gray-900">Active Sessions</h3><button onClick={() => setShowSessions(false)} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button></div>
            <div className="space-y-3">
              {sessions.map((session) => (
                <div key={session.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center shrink-0"><session.Icon className="w-5 h-5 text-gray-600" /></div>
                  <div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-900 truncate">{session.device}</p><p className="text-xs text-gray-500">{session.location} · {session.lastActive}</p></div>
                  {session.current ? <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg shrink-0">Current</span> : <button onClick={() => { setSessions((p) => p.filter((s) => s.id !== session.id)); showToast("Session revoked"); }} className="text-xs text-red-600 hover:text-red-700 font-medium shrink-0">Revoke</button>}
                </div>
              ))}
            </div>
            <button onClick={() => { setSessions(SESSIONS.filter((s) => s.current)); showToast("All other sessions revoked"); }} className="mt-4 w-full py-2.5 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50">Revoke All Other Sessions</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;