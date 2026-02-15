'use client'

import type { DataInspectorInfo } from '@/types'

interface DataInspectorProps {
  info: DataInspectorInfo
}

export function DataInspector({ info }: DataInspectorProps) {
  if (info.details.length === 0) return null

  return (
    <div className="mt-4 p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-slate-200/60 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-700 mb-3">Data Inspector</h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between py-1.5 border-b border-slate-200/50">
          <span className="text-xs font-medium text-slate-600">Type</span>
          <span className="text-xs font-mono text-blue-600">{info.type}</span>
        </div>
        {info.details.map((detail, idx) => (
          <div key={idx} className="flex items-center justify-between py-1.5">
            <span className="text-xs font-medium text-slate-600">{detail.label}</span>
            <span className="text-xs font-mono text-slate-900 max-w-[200px] truncate" title={detail.value}>
              {detail.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
