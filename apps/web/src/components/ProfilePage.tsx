'use client'

import { User, Mail, Phone, Edit2, Save, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useProfile } from '@/hooks/useProfile'
import { apiClient } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth-store'

export default function ProfilePage() {
  const { profile, isLoading, update, updating } = useProfile()
  const { accessToken } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
  })
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        email: profile.email || '',
        phoneNumber: profile.phoneNumber || '',
      })
    }
  }, [profile])

  const handleSave = async () => {
    try {
      await update({
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
      })
      setMessage({ type: 'success', text: 'Profile updated successfully' })
      setIsEditing(false)
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' })
    }
  }

  const handleCancel = () => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        email: profile.email || '',
        phoneNumber: profile.phoneNumber || '',
      })
    }
    setIsEditing(false)
    setMessage(null)
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#0a0e27]">
        <div className="text-[#94a3b8]">Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto bg-[#0a0e27] p-3 sm:p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#94a3b8] mb-2 flex items-center gap-2 sm:gap-3">
            <User className="h-6 w-6 sm:h-8 sm:w-8" />
            Profile
          </h1>
          <p className="text-white">Manage your personal information</p>
        </div>

        {message && (
          <div className={`mb-4 sm:mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-[#d4edda] text-[#155724]' : 'bg-[#f8d7da] text-[#721c24]'
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-[#161b3d] border border-[#1e293b] rounded-lg p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl font-semibold text-white">Personal Information</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#6366f1] text-white rounded-lg hover:bg-[#4f46e5] transition"
              >
                <Edit2 className="h-4 w-4" />
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={updating}
                  className="flex items-center gap-2 px-4 py-2 bg-[#6366f1] text-white rounded-lg hover:bg-[#4f46e5] transition disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {updating ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-[#0d1230] border border-[#1e293b] text-white rounded-lg hover:bg-[#161b3d] transition"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#94a3b8] mb-2 flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2 border border-[#1e293b] rounded-lg bg-[#0d1230] text-white focus:outline-none focus:ring-2 focus:ring-[#94a3b8]"
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="px-4 py-2 bg-[#0d1230] border border-[#1e293b] rounded-lg text-white">
                  {profile?.fullName || 'Not set'}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#94a3b8] mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-[#1e293b] rounded-lg bg-[#0d1230] text-white focus:outline-none focus:ring-2 focus:ring-[#94a3b8]"
                  placeholder="Enter your email"
                />
              ) : (
                <div className="px-4 py-2 bg-[#0d1230] border border-[#1e293b] rounded-lg text-white">
                  {profile?.email || 'Not set'}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#94a3b8] mb-2 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-[#1e293b] rounded-lg bg-[#0d1230] text-white focus:outline-none focus:ring-2 focus:ring-[#94a3b8]"
                  placeholder="Enter your phone number"
                />
              ) : (
                <div className="px-4 py-2 bg-[#0d1230] border border-[#1e293b] rounded-lg text-white">
                  {profile?.phoneNumber || 'Not set'}
                </div>
              )}
            </div>

            {profile && (
              <div className="pt-4 border-t border-[#1e293b]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-[#94a3b8] mb-1">Account ID</div>
                    <div className="text-white font-mono text-xs">{profile.id}</div>
                  </div>
                  <div>
                    <div className="text-[#94a3b8] mb-1">Leverage</div>
                    <div className="text-white">1:{profile.leverage || 100}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
