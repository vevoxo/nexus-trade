'use client'

import { Bell, CheckCircle, AlertCircle, Info, X } from 'lucide-react'
import { useState } from 'react'

interface Notification {
  id: string
  type: 'success' | 'error' | 'info'
  title: string
  message: string
  time: string
  read: boolean
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Trade Executed',
      message: 'Your BUY order for EURUSD has been executed successfully',
      time: '2 minutes ago',
      read: false,
    },
    {
      id: '2',
      type: 'info',
      title: 'Price Alert',
      message: 'EURUSD has reached your target price of 1.0850',
      time: '1 hour ago',
      read: false,
    },
    {
      id: '3',
      type: 'error',
      title: 'Insufficient Margin',
      message: 'You do not have enough margin to open this position',
      time: '3 hours ago',
      read: true,
    },
  ])

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  return (
    <div className="h-full overflow-y-auto bg-[#0a0e27] p-3 sm:p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#94a3b8] mb-2 flex items-center gap-2 sm:gap-3">
            <Bell className="h-6 w-6 sm:h-8 sm:w-8" />
            Notifications
          </h1>
          <p className="text-white">Stay updated with your trading activity</p>
        </div>

        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="bg-[#161b3d] border border-[#1e293b] rounded-lg p-12 text-center">
              <Bell className="h-12 w-12 text-[#1e293b] mx-auto mb-4" />
              <p className="text-[#94a3b8]">No notifications</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-[#161b3d] border border-[#1e293b] rounded-lg p-4 ${
                  !notification.read ? 'border-l-4 border-l-[#94a3b8]' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">{getIcon(notification.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-white mb-1">{notification.title}</h3>
                        <p className="text-sm text-[#94a3b8] mb-2">{notification.message}</p>
                        <p className="text-xs text-[#a69b8a]">{notification.time}</p>
                      </div>
                      <div className="flex gap-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-[#94a3b8] hover:text-white"
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-[#94a3b8] hover:text-white"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
