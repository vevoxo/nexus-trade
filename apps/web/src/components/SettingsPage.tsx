'use client'

import { Settings, User, Bell, Shield, Globe, Moon, Sun } from 'lucide-react'
import { useState } from 'react'

export default function SettingsPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
  })

  return (
    <div className="h-full overflow-y-auto bg-[#0a0e27] p-3 sm:p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#94a3b8] mb-2 flex items-center gap-2 sm:gap-3">
            <Settings className="h-6 w-6 sm:h-8 sm:w-8" />
            Settings
          </h1>
          <p className="text-white">Manage your account settings and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Account Settings */}
          <div className="bg-[#161b3d] border border-[#1e293b] rounded-lg p-3 sm:p-4 lg:p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-[#94a3b8]" />
              Account Settings
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">Two-Factor Authentication</div>
                  <div className="text-sm text-[#94a3b8]">Add an extra layer of security</div>
                </div>
                <button className="px-4 py-2 bg-[#6366f1] text-white rounded-lg hover:bg-[#4f46e5] transition text-sm">
                  Enable
                </button>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-[#161b3d] border border-[#1e293b] rounded-lg p-3 sm:p-4 lg:p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5 text-[#94a3b8]" />
              Notifications
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">Email Notifications</div>
                  <div className="text-sm text-[#94a3b8]">Receive updates via email</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#94a3b8]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#0d1230] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6366f1]"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">Push Notifications</div>
                  <div className="text-sm text-[#94a3b8]">Receive browser notifications</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.push}
                    onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#94a3b8]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#0d1230] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6366f1]"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-[#161b3d] border border-[#1e293b] rounded-lg p-3 sm:p-4 lg:p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#94a3b8]" />
              Privacy & Security
            </h2>
            <div className="space-y-4">
              <button className="w-full text-left px-4 py-3 bg-[#0d1230] border border-[#1e293b] rounded-lg hover:bg-[#161b3d] transition text-white">
                Change Password
              </button>
              <button className="w-full text-left px-4 py-3 bg-[#0d1230] border border-[#1e293b] rounded-lg hover:bg-[#161b3d] transition text-white">
                Privacy Settings
              </button>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-[#161b3d] border border-[#1e293b] rounded-lg p-3 sm:p-4 lg:p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              {theme === 'light' ? <Sun className="h-5 w-5 text-[#94a3b8]" /> : <Moon className="h-5 w-5 text-[#94a3b8]" />}
              Appearance
            </h2>
            <div className="flex gap-4">
              <button
                onClick={() => setTheme('light')}
                className={`px-4 py-2 rounded-lg transition ${
                  theme === 'light' ? 'bg-[#6366f1] text-white' : 'bg-[#0d1230] border border-[#1e293b] text-white'
                }`}
              >
                Light
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-4 py-2 rounded-lg transition ${
                  theme === 'dark' ? 'bg-[#6366f1] text-white' : 'bg-[#0d1230] border border-[#1e293b] text-white'
                }`}
              >
                Dark
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
