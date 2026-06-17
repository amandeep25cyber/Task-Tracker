import { Card } from "../../components/ui/Card";
import { Bell, Shield, Globe, Mail } from "lucide-react";

const Settings = ()=> {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account and system preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Notifications</h3>
            </div>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Email notifications</span>
                <input type="checkbox" defaultChecked className="w-10 h-6 appearance-none bg-blue-600 rounded-full relative cursor-pointer checked:bg-blue-600 transition-colors" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Push notifications</span>
                <input type="checkbox" defaultChecked className="w-10 h-6 appearance-none bg-blue-600 rounded-full relative cursor-pointer checked:bg-blue-600 transition-colors" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Task reminders</span>
                <input type="checkbox" className="w-10 h-6 appearance-none bg-gray-300 rounded-full relative cursor-pointer checked:bg-blue-600 transition-colors" />
              </label>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Security</h3>
            </div>
            <div className="space-y-3">
              <button className="w-full py-2 px-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-sm text-left">
                Change Password
              </button>
              <button className="w-full py-2 px-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-sm text-left">
                Two-Factor Authentication
              </button>
              <button className="w-full py-2 px-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-sm text-left">
                Active Sessions
              </button>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Preferences</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Language</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Timezone</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>UTC-8 (Pacific)</option>
                  <option>UTC-5 (Eastern)</option>
                  <option>UTC+0 (GMT)</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Email Preferences</h3>
            </div>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Weekly reports</span>
                <input type="checkbox" defaultChecked className="w-10 h-6 appearance-none bg-blue-600 rounded-full relative cursor-pointer checked:bg-blue-600 transition-colors" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Product updates</span>
                <input type="checkbox" className="w-10 h-6 appearance-none bg-gray-300 rounded-full relative cursor-pointer checked:bg-blue-600 transition-colors" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Team mentions</span>
                <input type="checkbox" defaultChecked className="w-10 h-6 appearance-none bg-blue-600 rounded-full relative cursor-pointer checked:bg-blue-600 transition-colors" />
              </label>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Settings;