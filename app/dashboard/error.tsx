'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, RefreshCcw, ChevronDown, ChevronUp } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const [showDetails, setShowDetails] = useState(false)

    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
            <div className="max-w-2xl w-full">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                                <AlertTriangle className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold text-white mb-1">
                                    Oops! Something Went Wrong
                                </h1>
                                <p className="text-white/90 text-sm">
                                    We encountered an unexpected error while processing your request
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 space-y-6">
                        {/* Error Message */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                                Error Message
                            </h3>
                            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                <p className="text-slate-800 text-sm font-mono break-words">
                                    {error.message || 'An unknown error occurred'}
                                </p>
                            </div>
                        </div>

                        {/* Digest ID */}
                        {error.digest && (
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                                    Error ID
                                </h3>
                                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                    <p className="text-slate-600 text-sm font-mono">
                                        {error.digest}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Advanced Details - Collapsible */}
                        <div className="border-t border-slate-200 pt-6">
                            <button
                                onClick={() => setShowDetails(!showDetails)}
                                className="flex items-center justify-between w-full text-left group"
                            >
                                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide group-hover:text-slate-900 transition-colors">
                                    Advanced Details
                                </h3>
                                {showDetails ? (
                                    <ChevronUp className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                                )}
                            </button>

                            {showDetails && (
                                <div className="mt-4 bg-slate-900 rounded-lg p-4 overflow-x-auto">
                                    <pre className="text-xs text-slate-100 font-mono whitespace-pre-wrap break-words">
                                        {error.stack || 'No stack trace available'}
                                    </pre>
                                </div>
                            )}
                        </div>

                        {/* Action Button */}
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={reset}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-semibold rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                <RefreshCcw className="w-4 h-4" />
                                Try Again
                            </button>
                            <button
                                onClick={() => window.location.href = '/dashboard'}
                                className="px-6 py-3 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                            >
                                Go Home
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
                        <p className="text-xs text-slate-500 text-center">
                            If this problem persists, please contact support with the Error ID above
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}