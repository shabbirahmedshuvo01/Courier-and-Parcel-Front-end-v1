import React from 'react'

export default function LoadingPage() {
  return (
    <div>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl">📦</span>
                        </div>
                    </div>
                    <p className="text-slate-600 text-lg font-medium">Loading your parcels...</p>
                    <p className="text-slate-500 text-sm mt-1">Please wait while we fetch your data</p>
                </div>
            </div>
    </div>
  )
}
