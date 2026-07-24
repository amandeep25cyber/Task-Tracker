import { Card } from "../../components/ui/Card";
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Edit2, Save, X, CheckCircle2, FolderKanban } from "lucide-react";
import { useState } from "react";

const initial = {
  name: "Alex Morgan",
  title: "Frontend Developer",
  email: "alex.morgan@company.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  position: "Frontend Developer",
  joinDate: "January 15, 2025",
  reportsTo: "Mike Chen — Project Manager",
  bio: "Passionate frontend developer with a focus on building clean, accessible, and performant web applications.",
};

function Field({ label, value, icon, editing, onChange, placeholder
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs font-medium text-gray-500 mb-0.5">{label}</p>
        {editing ? (
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 bg-gray-50"
          />
        ) : (
          <p className="font-medium text-gray-900 text-sm">{value}</p>
        )}
      </div>
    </div>
  );
}

const Profile = ()=> {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState(initial);
  const [draft, setDraft] = useState(initial);

  const startEdit = () => { setDraft({ ...profile }); setEditing(true); setSaved(false); };
  const cancel = () => { setEditing(false); };
  const save = () => {
    setProfile({ ...draft });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };
  const set = (key) => (value) => setDraft((d) => ({ ...d, [key]: value }));

  const current = editing ? draft : profile;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your personal information</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium bg-emerald-50 px-3 py-1.5 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
              Saved!
            </div>
          )}
          {editing ? (
            <>
              <button
                onClick={cancel}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={save}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={startEdit}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar card */}
        <Card>
          <div className="p-6 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 bg-linear-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center mx-auto">
                <span className="text-white text-3xl font-bold">
                  {current.name.split(" ").map((n) => n[0]).join("").substring(0, 2)}
                </span>
              </div>
              {editing && (
                <button className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-md">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {editing ? (
              <input
                value={draft.name}
                onChange={(e) => set("name")(e.target.value)}
                className="w-full text-center text-xl font-semibold text-gray-900 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-1 bg-gray-50"
              />
            ) : (
              <h2 className="text-xl font-semibold text-gray-900 mb-1">{profile.name}</h2>
            )}
            {editing ? (
              <input
                value={draft.title}
                onChange={(e) => set("title")(e.target.value)}
                className="w-full text-center text-sm text-gray-500 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 bg-gray-50"
              />
            ) : (
              <p className="text-gray-500 text-sm mb-4">{profile.title}</p>
            )}

            {!editing && (
              <div className="flex items-center justify-center gap-2 text-sm text-emerald-600 mb-4">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                Active
              </div>
            )}

            {editing ? (
              <div className="pt-4 border-t border-gray-100">
                <label className="text-xs text-gray-500 font-medium block mb-1.5">Bio</label>
                <textarea
                  value={draft.bio}
                  onChange={(e) => set("bio")(e.target.value)}
                  rows={3}
                  className="w-full text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none"
                />
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 text-center leading-relaxed mb-5 px-2">{profile.bio}</p>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-0.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <p className="text-2xl font-bold text-gray-900">47</p>
                    </div>
                    <p className="text-xs text-gray-500">Tasks Done</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-0.5">
                      <FolderKanban className="w-4 h-4 text-blue-500" />
                      <p className="text-2xl font-bold text-gray-900">3</p>
                    </div>
                    <p className="text-xs text-gray-500">Projects</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card title="Personal Information">
            <div className="p-6 space-y-5">
              <Field label="Full Name" value={current.name} icon={<User className="w-5 h-5 text-blue-600" />} editing={editing} onChange={set("name")} />
              <Field label="Email Address" value={current.email} icon={<Mail className="w-5 h-5 text-emerald-600" />} editing={editing} onChange={set("email")} placeholder="you@company.com" />
              <Field label="Phone Number" value={current.phone} icon={<Phone className="w-5 h-5 text-violet-600" />} editing={editing} onChange={set("phone")} placeholder="+1 (555) 000-0000" />
              <Field label="Location" value={current.location} icon={<MapPin className="w-5 h-5 text-orange-500" />} editing={editing} onChange={set("location")} placeholder="City, State" />
            </div>
          </Card>

          <Card title="Work Information">
            <div className="p-6 space-y-5">
              <Field label="Position" value={current.position} icon={<Briefcase className="w-5 h-5 text-blue-600" />} editing={editing} onChange={set("position")} />
              <Field label="Join Date" value={current.joinDate} icon={<Calendar className="w-5 h-5 text-emerald-600" />} editing={false} onChange={() => {}} />
              <Field label="Reports To" value={current.reportsTo} icon={<User className="w-5 h-5 text-violet-600" />} editing={editing} onChange={set("reportsTo")} />
            </div>
          </Card>

          {!editing && (
            <Card title="Notification Preferences">
              <div className="p-6 space-y-4">
                {[
                  { label: "Email notifications for task assignments", enabled: true },
                  { label: "Slack notifications for mentions", enabled: true },
                  { label: "Weekly digest emails", enabled: false },
                  { label: "Mobile push notifications", enabled: true },
                ].map((pref) => (
                  <div key={pref.label} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{pref.label}</span>
                    <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${pref.enabled ? "bg-blue-600" : "bg-gray-300"}`}>
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform shadow-sm ${pref.enabled ? "translate-x-5" : "translate-x-0.5"}`} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;