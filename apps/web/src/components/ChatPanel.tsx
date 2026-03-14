'use client'

import { useEffect, useMemo, useState } from 'react'
import { ChatMessage, ChatThreadPreview } from '@/hooks/useChat'

type Props = {
  open: boolean
  onClose: () => void
  isAdmin: boolean
  threads: ChatThreadPreview[]
  threadsLoading: boolean
  activeUserId: string | null
  setActiveUserId: (id: string | null) => void
  messages: ChatMessage[]
  messagesLoading: boolean
  onSendUser: (content: string) => Promise<any>
  onSendAdmin: (params: { userId: string; content: string }) => Promise<any>
  sending: boolean
}

export function ChatPanel({
  open,
  onClose,
  isAdmin,
  threads,
  threadsLoading,
  activeUserId,
  setActiveUserId,
  messages,
  messagesLoading,
  onSendUser,
  onSendAdmin,
  sending,
}: Props) {
  const [content, setContent] = useState('')

  useEffect(() => {
    if (!isAdmin && threads.length > 0 && !activeUserId) {
      setActiveUserId(threads[0].userId)
    }
    if (isAdmin && threads.length > 0 && !activeUserId) {
      setActiveUserId(threads[0].userId)
    }
  }, [isAdmin, threads, activeUserId, setActiveUserId])

  if (!open) return null

  const currentMessages = messages

  const handleSend = async () => {
    if (!content.trim()) return
    const text = content.trim()
    setContent('')
    if (isAdmin) {
      if (!activeUserId) return
      await onSendAdmin({ userId: activeUserId, content: text })
    } else {
      await onSendUser(text)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-2xl h-full bg-bg-secondary border-l border-[#1e293b] flex">
        {isAdmin && (
          <div className="w-1/3 border-r border-[#1e293b] flex flex-col">
            <div className="p-3 border-b border-[#1e293b] flex items-center justify-between">
              <h2 className="text-sm font-semibold">Conversations</h2>
              <button onClick={onClose} className="text-xs text-[#94a3b8] hover:text-white">Close</button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {threadsLoading ? (
                <p className="text-xs text-[#94a3b8] p-3">Loading...</p>
              ) : threads.length === 0 ? (
                <p className="text-xs text-[#94a3b8] p-3">No messages yet</p>
              ) : (
                threads.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveUserId(t.userId)}
                    className={`w-full text-left px-3 py-2 border-b border-[#1e293b] hover:bg-bg-card ${
                      activeUserId === t.userId ? 'bg-bg-card' : ''
                    }`}
                  >
                    <div className="text-sm font-semibold">{t.userId}</div>
                    <div className="text-xs text-[#94a3b8] truncate">{t.content}</div>
                    <div className="text-[10px] text-[#475569]">{new Date(t.createdAt).toLocaleString()}</div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col">
          {!isAdmin && (
            <div className="p-3 border-b border-[#1e293b] flex items-center justify-between">
              <h2 className="text-sm font-semibold">Support Chat</h2>
              <button onClick={onClose} className="text-xs text-[#94a3b8] hover:text-white">Close</button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
            {messagesLoading ? (
              <p className="text-xs text-[#94a3b8]">Loading...</p>
            ) : currentMessages.length === 0 ? (
              <p className="text-xs text-[#94a3b8]">No messages yet</p>
            ) : (
              currentMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.fromRole === 'ADMIN' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                      msg.fromRole === 'ADMIN' ? 'bg-accent-purple text-white' : 'bg-bg-card text-white border border-[#1e293b]'
                    }`}
                  >
                    <div className="text-[10px] text-[#cbd5e1]">
                      {msg.fromRole === 'ADMIN' ? 'Admin' : 'You'} · {new Date(msg.createdAt).toLocaleTimeString()}
                    </div>
                    <div>{msg.content}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 border-t border-[#1e293b] flex gap-2">
            <textarea
              className="flex-1 bg-bg-card border border-[#1e293b] rounded px-3 py-2 text-sm focus:outline-none focus:border-accent-purple"
              rows={2}
              placeholder="Type a message..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button
              onClick={handleSend}
              disabled={sending || (isAdmin && !activeUserId)}
              className="px-4 py-2 bg-accent-purple rounded text-white font-semibold disabled:opacity-60"
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

