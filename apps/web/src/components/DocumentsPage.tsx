'use client'

import { FileText, Download, Eye, File, Calendar } from 'lucide-react'

interface Document {
  id: string
  name: string
  type: string
  date: string
  size: string
}

export default function DocumentsPage() {
  const documents: Document[] = [
    {
      id: '1',
      name: 'Account Statement - January 2024',
      type: 'PDF',
      date: '2024-01-31',
      size: '245 KB',
    },
    {
      id: '2',
      name: 'Trade History Report',
      type: 'CSV',
      date: '2024-01-30',
      size: '128 KB',
    },
    {
      id: '3',
      name: 'Tax Document 2023',
      type: 'PDF',
      date: '2024-01-15',
      size: '512 KB',
    },
  ]

  return (
    <div className="h-full overflow-y-auto bg-[#0a0e27] p-3 sm:p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#94a3b8] mb-2 flex items-center gap-2 sm:gap-3">
            <FileText className="h-6 w-6 sm:h-8 sm:w-8" />
            Documents & Reports
          </h1>
          <p className="text-white">Access your account statements and trading reports</p>
        </div>

        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-[#161b3d] border border-[#1e293b] rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-3 bg-[#6366f1]/10 rounded-lg">
                    <File className="h-6 w-6 text-[#94a3b8]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">{doc.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-[#94a3b8]">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {doc.date}
                      </span>
                      <span>{doc.type}</span>
                      <span>{doc.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-[#94a3b8] hover:bg-[#161b3d] rounded-lg transition">
                    <Eye className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-[#94a3b8] hover:bg-[#161b3d] rounded-lg transition">
                    <Download className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-[#161b3d] border border-[#1e293b] rounded-lg p-3 sm:p-4 lg:p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Generate New Report</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[#94a3b8] mb-2">Report Type</label>
              <select className="w-full px-4 py-2 border border-[#1e293b] rounded-lg bg-[#0d1230] text-white focus:outline-none focus:ring-2 focus:ring-[#94a3b8]">
                <option>Account Statement</option>
                <option>Trade History</option>
                <option>Tax Report</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#94a3b8] mb-2">From Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-[#1e293b] rounded-lg bg-[#0d1230] text-white focus:outline-none focus:ring-2 focus:ring-[#94a3b8]"
                />
              </div>
              <div>
                <label className="block text-sm text-[#94a3b8] mb-2">To Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-[#1e293b] rounded-lg bg-[#0d1230] text-white focus:outline-none focus:ring-2 focus:ring-[#94a3b8]"
                />
              </div>
            </div>
            <button className="w-full py-2 bg-[#6366f1] text-white rounded-lg hover:bg-[#4f46e5] transition">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
