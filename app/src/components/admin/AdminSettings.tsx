import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { 
  Save, 
  Bell, 
  Shield, 
  Globe,
  CreditCard,
  Users,
  CheckCircle,
  Loader2
} from 'lucide-react';

export default function AdminSettings() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'users', label: 'User Settings', icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-950">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your platform settings and preferences</p>
        </div>
        <Button 
          className="bg-gradient-brand text-white hover:opacity-90 gap-2"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : saveSuccess ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Settings Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'general' && (
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
              <h3 className="font-display font-semibold text-navy-950">General Settings</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Platform Name</label>
                  <Input defaultValue="CashSupportShipment" className="h-12" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Support Email</label>
                  <Input defaultValue="support@cashsupportshipment.com" className="h-12" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Support Phone</label>
                  <Input defaultValue="+1 (800) 555-SHIP" className="h-12" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Timezone</label>
                  <select className="w-full h-12 px-4 rounded-md border border-gray-200">
                    <option>UTC-05:00 Eastern Time (ET)</option>
                    <option>UTC-08:00 Pacific Time (PT)</option>
                    <option>UTC+00:00 Greenwich Mean Time (GMT)</option>
                    <option>UTC+01:00 Central European Time (CET)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between py-4 border-t border-gray-100">
                  <div>
                    <p className="font-medium text-navy-950">Maintenance Mode</p>
                    <p className="text-sm text-gray-500">Temporarily disable the platform for maintenance</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
              <h3 className="font-display font-semibold text-navy-950">Notification Settings</h3>
              
              <div className="space-y-4">
                {[
                  { name: 'New User Registration', desc: 'Get notified when a new user signs up', enabled: true },
                  { name: 'New Shipment Created', desc: 'Get notified when a new shipment is created', enabled: true },
                  { name: 'Delivery Completed', desc: 'Get notified when a package is delivered', enabled: true },
                  { name: 'Failed Delivery', desc: 'Get notified when a delivery fails', enabled: true },
                  { name: 'Support Ticket', desc: 'Get notified when a new support ticket is created', enabled: false },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-navy-950">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                    <Switch defaultChecked={item.enabled} />
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h4 className="font-medium text-navy-950 mb-4">Notification Channels</h4>
                <div className="space-y-3">
                  {[
                    { name: 'Email Notifications', enabled: true },
                    { name: 'Push Notifications', enabled: true },
                    { name: 'SMS Notifications', enabled: false },
                  ].map((channel) => (
                    <div key={channel.name} className="flex items-center justify-between">
                      <span className="text-gray-700">{channel.name}</span>
                      <Switch defaultChecked={channel.enabled} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
              <h3 className="font-display font-semibold text-navy-950">Security Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-navy-950">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500">Require 2FA for all admin accounts</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-navy-950">Force Password Reset</p>
                    <p className="text-sm text-gray-500">Require password reset every 90 days</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-navy-950">Login Notifications</p>
                    <p className="text-sm text-gray-500">Send email on new device login</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2 pt-4 border-t border-gray-100">
                  <label className="text-sm font-medium text-gray-700">Session Timeout (minutes)</label>
                  <Input type="number" defaultValue="30" className="h-12" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Max Login Attempts</label>
                  <Input type="number" defaultValue="5" className="h-12" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
              <h3 className="font-display font-semibold text-navy-950">Payment Settings</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Currency</label>
                  <select className="w-full h-12 px-4 rounded-md border border-gray-200">
                    <option>USD - US Dollar</option>
                    <option>EUR - Euro</option>
                    <option>GBP - British Pound</option>
                    <option>CAD - Canadian Dollar</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Default Payment Gateway</label>
                  <select className="w-full h-12 px-4 rounded-md border border-gray-200">
                    <option>Stripe</option>
                    <option>PayPal</option>
                    <option>Square</option>
                  </select>
                </div>

                <div className="flex items-center justify-between py-3 border-t border-gray-100">
                  <div>
                    <p className="font-medium text-navy-950">Accept Credit Cards</p>
                    <p className="text-sm text-gray-500">Enable credit card payments</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-navy-950">Accept PayPal</p>
                    <p className="text-sm text-gray-500">Enable PayPal payments</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-navy-950">Accept Cryptocurrency</p>
                    <p className="text-sm text-gray-500">Enable crypto payments</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
              <h3 className="font-display font-semibold text-navy-950">User Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-navy-950">Public Registration</p>
                    <p className="text-sm text-gray-500">Allow users to register on the platform</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-navy-950">Email Verification</p>
                    <p className="text-sm text-gray-500">Require email verification for new accounts</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-navy-950">Auto-Approve Businesses</p>
                    <p className="text-sm text-gray-500">Automatically approve business accounts</p>
                  </div>
                  <Switch />
                </div>

                <div className="space-y-2 pt-4 border-t border-gray-100">
                  <label className="text-sm font-medium text-gray-700">Max Users Per Business</label>
                  <Input type="number" defaultValue="10" className="h-12" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Default User Role</label>
                  <select className="w-full h-12 px-4 rounded-md border border-gray-200">
                    <option>User</option>
                    <option>Business</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
